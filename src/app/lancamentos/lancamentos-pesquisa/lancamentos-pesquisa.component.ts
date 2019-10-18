import {Component, OnInit, ViewChild} from '@angular/core';
import {LancamentoFiltro, LancamentoService} from "../lancamento.service";
import {ConfirmationService, LazyLoadEvent} from "primeng/components/common/api";
import {Table} from "primeng/components/table/table";
import {Lancamento} from "../lancamento";
import {ToastyService} from "ng2-toasty";
import {ErrorHandlerService} from "../../core/error-handler.service";
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../seguranca/auth.service";
import {Page} from "../page";

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {
  filtro = new LancamentoFiltro();
  page: Page<Lancamento> = new Page<Lancamento>();
  @ViewChild('tabela', {static: true}) grid: Table;

  constructor(private lancamentoService: LancamentoService,
              private errorHandler: ErrorHandlerService,
              private toasty: ToastyService,
              private confirmation: ConfirmationService,
              private title: Title,
              private auth: AuthService) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de lançamentos');
  }

  pesquisar(pagina = 0) {
    this.filtro.page = pagina;

    this.lancamentoService.pesquisar( this.filtro )
      .subscribe(data => {
          this.page = data;
        },

        responseErro => {
          this.errorHandler.handle(responseErro);
          }
      );
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(codigo: number) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(codigo);
      }
    });
  }

  excluir(codigo: number) {
    this.lancamentoService.excluir(codigo)
      .subscribe( responseSucesso => {
          this.grid.reset();
          this.toasty.success('Lançamento excluído com sucesso!');
        },
        responseErro => {
          this.errorHandler.handle(responseErro);
        }
      );
  }
}
