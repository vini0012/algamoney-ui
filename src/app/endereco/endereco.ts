import {Cidade} from '../pessoas/cidade';

export class Endereco {
  logradouro : string;
  numero : string;
  complemento : string;
  bairro : string;
  cep : string;
  cidade = new Cidade();
}
