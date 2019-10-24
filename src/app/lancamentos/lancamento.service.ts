import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {map} from 'rxjs/operators';
import {Lancamento} from './lancamento';
import {Page} from './page';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoDe: Date;
  dataVencimentoAte: Date;
  page = 0;
  size = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: HttpClient) {
  }

  urlUploadAnexo(): string {
    return `${this.lancamentosUrl}/anexo`;
  }

  pesquisar(filtro: LancamentoFiltro): Observable<Page<Lancamento>> {
    return this.http.post<Page<Lancamento>>(`${this.lancamentosUrl}/resumo`, filtro);
  }

  excluir(codigo: number): Observable<void> {
    return this.http.delete<void>(`${this.lancamentosUrl}/${codigo}`);
  }

  adicionar(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.post<Lancamento>(`${this.lancamentosUrl}`, lancamento);
  }

  atualizar(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento);
  };

  buscarPorCodigo(codigo: number): Observable<Lancamento> {
    return this.http.get(`${this.lancamentosUrl}/${codigo}`)
      .pipe(map(response => {
        const lancamento = response as Lancamento;
        this.converterStringsParaDatas([lancamento]);
        return lancamento;
      }));
  }

  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      console.log(lancamento);
      lancamento.dataVencimento = moment(lancamento.dataVencimento,
        'YYYY-MM-DD').toDate();

      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento,
          'YYYY-MM-DD').toDate();
      }
    }
  }

}
