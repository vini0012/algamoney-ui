import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ConfirmDialogModule} from 'primeng/components/confirmdialog/confirmdialog';
import {LancamentoService} from '../lancamentos/lancamento.service';
import {PessoaService} from '../pessoas/pessoa.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {NavbarComponent} from './navbar/navbar.component';
import {ErrorHandlerService} from './error-handler.service';
import {RouterModule} from '@angular/router';
import {PaginaNaoEncontradaComponent} from './pagina-nao-encontrada.component';
import {Title} from '@angular/platform-browser';
import {AuthService} from '../seguranca/auth.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {NaoAutorizadoComponent} from './nao-autorizado.component';
import {DashboardService} from '../dashboard/dashboard.service';
import {RelatoriosService} from '../relatorios/relatorios.service';
import {ToastModule} from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    ToastModule,
    ConfirmDialogModule,
    RouterModule
  ],
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    NaoAutorizadoComponent],
  exports: [
    NavbarComponent,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [
    ErrorHandlerService,
    LancamentoService,
    PessoaService,
    ConfirmationService,
    Title,
    AuthService,
    JwtHelperService,
    DashboardService,
    RelatoriosService,
    MessageService
  ]
})
export class CoreModule { }
