import {Component, OnInit, ViewChild} from '@angular/core';
import {PessoaFiltro, PessoaService} from '../pessoa.service';
import {ConfirmationService, LazyLoadEvent, MessageService} from 'primeng/components/common/api';
import {Table} from 'primeng/components/table/table';
import {ErrorHandlerService} from '../../core/error-handler.service';
import {Pessoa} from '../pessoa';
import {Title} from '@angular/platform-browser';
import {AuthService} from '../../seguranca/auth.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit{
  totalRegistros = 0;
  filtro = new PessoaFiltro();
  @ViewChild('tabela', {static: true}) grid: Table;
  pessoas: Pessoa[] = [];

  constructor(private pessoaService: PessoaService,
              private errorHandler: ErrorHandlerService,
              private messageService: MessageService,
              private confirmation: ConfirmationService,
              private title: Title,
              private auth: AuthService) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar( this.filtro )
      .subscribe(data => {
        this.totalRegistros = data.total;
        this.pessoas = data.pessoasRegs;
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
    this.pessoaService.excluir(codigo)
      .subscribe( responseSucesso => {
        this.grid.reset();
          this.messageService.add({severity: 'success', detail: 'Pessoa excluída com sucesso!'});
      },
        responseErro => {
          this.errorHandler.handle(responseErro);
        }
      );
  }

  alternarStatus(pessoa: Pessoa): void {
    const novoStatus = !pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo, novoStatus)
      .subscribe(responseSucesso => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
          this.messageService.add({severity: 'success', detail: `Pessoa ${acao} com sucesso!`});
      },
        responseErro => {
          this.errorHandler.handle(responseErro)
        }
    );
  }

}
