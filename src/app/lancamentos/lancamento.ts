import {Categoria} from '../categorias/categoria';
import {Pessoa} from '../pessoas/pessoa';

export class Lancamento {
  codigo : number;
  descricao : string;
  dataVencimento : Date;
  dataPagamento : Date;
  valor : number;
  observacao : string;
  tipo = 'RECEITA';
  categoria = new Categoria();
  pessoa = new Pessoa();
  anexo: string;
  urlAnexo: string;
}
