import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokensRevokeUrl = 'http://localhost:8080/tokens/revoke';
  oauthTokenUrl = 'http://localhost:8080/oauth/token';
  jwtPayLoad: any;

  constructor(private http: HttpClient,
              private jwtHelper: JwtHelperService
  ) {
    this.carregarToken();
  }

  login(usuario: string, senha: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic YW5ndWxhcjpAbmd1bEByMA=='
    });

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post<void>(this.oauthTokenUrl, body, {headers: headers, withCredentials: true})
      .pipe(map(response => {
        const token = response['access_token'];
        this.armazenarToken(token);
        return token;
      }));
  }

  temPermissao(permissao: string) {
    return this.jwtPayLoad && this.jwtPayLoad.authorities.includes(permissao);
  }

  obterNovoAcessToken(): Promise<void> {
    const body = 'grant_type=refresh_token';

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic YW5ndWxhcjpAbmd1bEByMA=='
    });

    return this.http.post(this.oauthTokenUrl, body,
      {headers: headers, withCredentials: true})
      .toPromise()
      .then(response => {
        this.armazenarToken(response['access_token']);

        console.log('Novo access token criado!');

        return Promise.resolve(null);
      })
      .catch(response => {
        console.error('Erro ao renovar token.', response);
        return Promise.resolve(null);
      });
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  private armazenarToken(token: string) {
    this.jwtPayLoad = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }

  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayLoad = null;
  }

  logout() {
    return this.http.delete(this.tokensRevokeUrl, {withCredentials: true})
      .toPromise()
      .then(() => {
        this.limparAccessToken();
      });
  }

}
