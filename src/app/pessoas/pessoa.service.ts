import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Pessoa} from "./pessoa";

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  pessoasUrl = 'http://localhost:8080/pessoas';

  constructor(private http: HttpClient) {
  }

  pesquisar(filtro: PessoaFiltro): Observable<any> {
    let url = `${this.pessoasUrl}?page=${filtro.pagina}&size=${filtro.itensPorPagina}`;

    if (filtro.nome) {
      url += `&nome=${filtro.nome}`;
    }

    return this.http.get(url)
      .pipe(map(response => {
        const pessoas = response['content']
        return {
          pessoasRegs: pessoas,
          total: response['totalElements']
        }
      }))
  }

  listarTodas(): Observable<any> {
    return this.http.get(this.pessoasUrl)
      .pipe(map(response => {
        const pessoas = response['content'];
        return pessoas;
      }))
  }

  excluir(codigo: number): Observable<void> {
    return this.http.delete<void>(`${this.pessoasUrl}/${codigo}`);
  }

  mudarStatus(codigo: number, ativo: boolean): Observable<void> {
    return this.http.put<void>(`${this.pessoasUrl}/${codigo}/ativo`, null);
  }

  adicionar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(`${this.pessoasUrl}`, pessoa);
  }

  atualizar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa);
  }

  buscarPorCodigo(codigo: number): Observable<Pessoa> {
    return this.http.get(`${this.pessoasUrl}/${codigo}`)
      .pipe(map(response => {
        const pessoa = response as Pessoa;
        return pessoa;
      }));

  }
}

