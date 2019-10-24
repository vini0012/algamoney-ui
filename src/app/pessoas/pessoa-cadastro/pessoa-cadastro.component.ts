import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {PessoaService} from '../pessoa.service';
import {ErrorHandlerService} from '../../core/error-handler.service';
import {Pessoa} from '../pessoa';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {
  pessoa = new Pessoa();
  estados: any[];
  cidades: any[];
  estadoSelecionado: number;

  constructor(private pessoaService: PessoaService,
              private messageService: MessageService,
              private errorHandler: ErrorHandlerService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title) { }

  ngOnInit() {
    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova pessoa');

    this.carregarEstados();

    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    }
  }

  get editando() {
    return Boolean(this.pessoa.codigo)
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPorCodigo(codigo)
      .subscribe(pessoa => {
        this.pessoa = pessoa;

          this.estadoSelecionado = (this.pessoa.endereco.cidade) ?
            this.pessoa.endereco.cidade.estado.codigo : null;

          if (this.estadoSelecionado) {
            this.carregarCidades();
          }

        this.atualizarTituloEdicao();
      },
        responseError => {
          this.errorHandler.handle(responseError)
        }
      );
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: FormControl) {
    this.pessoaService.adicionar(this.pessoa)
      .subscribe(pessoaAdicionada => {
          this.messageService.add({severity: 'success', detail: 'Pessoa adicionada com sucesso!'});
          this.router.navigate(['/pessoas', pessoaAdicionada.codigo]);
        },
        responseErro => {
          this.errorHandler.handle(responseErro);
        }
      );
  }

  atualizarPessoa(form: FormControl) {
    this.pessoaService.atualizar(this.pessoa)
      .subscribe(pessoa => {
        this.pessoa = pessoa;
          this.messageService.add({severity: 'success', detail: 'Pessoa alterada com sucesso!'});
        this.atualizarTituloEdicao();
      },
        responseErro => {
          this.errorHandler.handle(responseErro);
        }
      );
  }

  nova(form: FormControl) {
    form.reset();

    setTimeout(function() {
      this.pessoa = new Pessoa();
    }.bind(this), 1);

    this.router.navigate(['/pessoas/nova']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
  }

  carregarEstados() {
    this.pessoaService.listarEstados()
      .then(lista => {
        this.estados = lista.map(uf => ({label: uf.nome, value: uf.codigo}));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCidades() {
    this.pessoaService.pesquisarCidades(this.estadoSelecionado)
      .then(lista => {
        this.cidades = lista.map(c => ({label: c.nome, value: c.codigo}));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
