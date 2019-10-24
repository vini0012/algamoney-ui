import {Component, OnInit} from '@angular/core';
import {CategoriaService} from '../../categorias/categoria.service';
import {ErrorHandlerService} from '../../core/error-handler.service';
import {PessoaService} from '../../pessoas/pessoa.service';
import {Lancamento} from '../lancamento';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LancamentoService} from '../lancamento.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {MessageService} from 'primeng/api';

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
  uploadEmAndamento = false;

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder
  ) {
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }

  get nomeAnexo() {
    const nomeAnexo = this.formulario.get('anexo').value;

    if (nomeAnexo) {
      return nomeAnexo.substring(nomeAnexo.indexOf('_') + 1, nomeAnexo.length);
    }

    return '';
  }

  get urlUploadAnexo() {
    return this.lancamentoService.urlUploadAnexo();
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: ['RECEITA', Validators.required],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      observacao: [],
      anexo: [],
      urlAnexo: []
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : {obrigatoriedade: true});
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : {tamanhoMinimo: {tamanho: valor}};
    };
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
          this.errorHandler.handle(responseError);
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
          this.messageService.add({severity: 'success', detail: 'Lançamento alterado com sucesso!'});
        },
        responseErro => {
          this.errorHandler.handle(responseErro);
        }
      );
  }

  adicionarLancamento() {
    this.lancamentoService.adicionar(this.formulario.value)
      .subscribe(lancamentoAdicionado => {
          this.messageService.add({severity: 'success', detail: 'Lançamento adicionado com sucesso!'});
          this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
        },
        responseErro => {
          this.errorHandler.handle(responseErro);
        }
      );
  }

  novo() {
    this.formulario.reset();

    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);

    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamento: ${this.formulario.get('descricao').value}`);
  }

  aoTerminarUploadAnexo(event) {
    const anexo = event.originalEvent.body;

    this.formulario.patchValue({
      anexo: anexo.nome,
      urlAnexo: anexo.url
    });
    this.uploadEmAndamento = false;
  }

  antesDoUpload(event) {
    this.uploadEmAndamento = true;
  }

  erroUpload(event) {
    this.messageService.add({severity: 'erro', detail: 'Erro ao tentar enviar anexo!'});
    this.uploadEmAndamento = false;
  }

  removerAnexo() {
    this.formulario.patchValue({
      anexo: null,
      urlAnexo: null
    });
  }

}
