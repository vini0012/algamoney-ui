import {Component, OnInit} from '@angular/core';
import {CategoriaService} from "../../categorias/categoria.service";
import {ErrorHandlerService} from "../../core/error-handler.service";
import {PessoaService} from "../../pessoas/pessoa.service";
import {Lancamento} from "../lancamento";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {LancamentoService} from "../lancamento.service";
import {ToastyService} from "ng2-toasty";
import {ActivatedRoute, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    {label: 'Receita', value: 'RECEITA'},
    {label: 'Despesa', value: 'DESPESA'},
  ];

  categorias = [];
  pessoas = [];
  //lancamento = new Lancamento();
  formulario: FormGroup;

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private toastyService: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) {
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: [ 'RECEITA', Validators.required ],
      dataVencimento: [ null, Validators.required ],
      dataPagamento: [],
      descricao: [null, [ this.validarObrigatoriedade, this.validarTamanhoMinimo(5) ]],
      valor: [ null, Validators.required ],
      pessoa: this.formBuilder.group({
        codigo: [ null, Validators.required ],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [ null, Validators.required ],
        nome: []
      }),
      observacao: []
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatoriedade: true });
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : {tamanhoMinimo: { tamanho: valor } };
    };
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }

  ngOnInit() {

    this.configurarFormulario();

    const codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo lançamento');

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
      .subscribe(lancamento => {
          //this.lancamento = lancamento;
          this.formulario.patchValue(lancamento);
          this.atualizarTituloEdicao();
        },
        responseError => {
          this.errorHandler.handle(responseError)
        }
      );
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .subscribe(categorias => {
          this.categorias = categorias.map(c => {
            return {label: c.nome, value: c.codigo};
          });
        },
        responseErro => {
          this.errorHandler.handle(responseErro);
        }
      );
  }

  carregarPessoas() {
    return this.pessoaService.listarTodas()
      .subscribe(pessoas => {
          this.pessoas = pessoas.map(c => {
            return {label: c.nome, value: c.codigo};
          });
        },
        responseErro => {
          this.errorHandler.handle(responseErro);
        }
      );
  }

  salvar() {
    if (this.editando) {
      this.atualizarLancamento();
    } else {
      this.adicionarLancamento();
    }
  }

  atualizarLancamento() {
    this.lancamentoService.atualizar(this.formulario.value)
      .subscribe(lancamento => {
          //this.lancamento = lancamento;
        this.formulario.patchValue(lancamento);
          this.atualizarTituloEdicao();
          this.toastyService.success('Lançamento alterado com sucesso!');
        },
        responseErro => {
          this.errorHandler.handle(responseErro);
        }
      );
  }

  adicionarLancamento() {
    this.lancamentoService.adicionar(this.formulario.value)
      .subscribe(lancamentoAdicionado => {
          this.toastyService.success('Lançamento adicionado com sucesso!');

          this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
        },
        responseErro => {
          this.errorHandler.handle(responseErro);
        }
      );
  }

  novo() {
    this.formulario.reset();

    setTimeout(function () {
      this.lancamento = new Lancamento();
    }.bind(this), 1);

    this.router.navigate(['/lancamentos/novo'])
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.formulario.get('descricao').value}`);
  }

}
