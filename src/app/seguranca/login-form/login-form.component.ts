import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {ErrorHandlerService} from '../../core/error-handler.service';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(private auth: AuthService,
              private errorHandler: ErrorHandlerService,
              private router: Router) {
  }

  ngOnInit() {
  }

  login(usuario: string, senha: string) {
    this.auth.login(usuario, senha)
      .pipe(map(response => {
        if (response.status === 400) {
          throw new Error(response);
        }
        return response
      }))
      .subscribe(
        response => {
          this.router.navigate(['/dashboard']);
        },
        erro => {
          if (erro.error.error === 'invalid_grant') {
            const msgErroUsuarioSenha: string = 'Usuário ou senha inválida!';
            this.errorHandler.handle(msgErroUsuarioSenha);
          } else {
            this.errorHandler.handle(erro);
          }
        });
  }

}
