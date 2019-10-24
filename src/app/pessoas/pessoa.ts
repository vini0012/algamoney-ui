import {Endereco} from '../endereco/endereco';
import {Contato} from './contato';

export class Pessoa {
  codigo: number;
  nome: string;
  endereco = new Endereco();
  ativo = true;
  contatos = new Array<Contato>();
}
