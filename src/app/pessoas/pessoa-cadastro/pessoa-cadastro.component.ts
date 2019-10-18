import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {PessoaService} from "../pessoa.service";
import {ToastyService} from "ng2-toasty";
import {ErrorHandlerService} from "../../core/error-handler.service";
import {Pessoa} from "../pessoa";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {
  pessoa = new Pessoa();

  constructor(private pessoaService: PessoaService,
              private toastyService: ToastyService,
              private errorHandler: ErrorHandlerService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title) { }

  ngOnInit() {
    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova pessoa');

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
          this.toastyService.success('Pessoa adicionada com sucesso!');
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

        this.toastyService.success('Pessoa alterada com sucesso!');
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

}
