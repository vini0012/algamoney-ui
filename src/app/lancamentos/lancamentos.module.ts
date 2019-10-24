import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CurrencyMaskModule} from 'ng2-currency-mask';
import {DropdownModule} from 'primeng/components/dropdown/dropdown';
import {SelectButtonModule} from 'primeng/components/selectbutton/selectbutton';
import {CalendarModule} from 'primeng/components/calendar/calendar';
import {InputTextareaModule} from 'primeng/components/inputtextarea/inputtextarea';
import {TableModule} from 'primeng/components/table/table';
import {TooltipModule} from 'primeng/components/tooltip/tooltip';
import {ButtonModule} from 'primeng/components/button/button';
import {InputTextModule} from 'primeng/components/inputtext/inputtext';

import {SharedModule} from './../shared/shared.module';
import {LancamentosPesquisaComponent} from './lancamentos-pesquisa/lancamentos-pesquisa.component';
import {LancamentoCadastroComponent} from './lancamento-cadastro/lancamento-cadastro.component';
import {LancamentosRoutingModule} from './lancamentos-routing.module';
import {FileUploadModule} from 'primeng/fileupload';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputTextareaModule,
    CalendarModule,
    SelectButtonModule,
    DropdownModule,
    CurrencyMaskModule,
    FileUploadModule,
    ProgressSpinnerModule,

    SharedModule,
    LancamentosRoutingModule
  ],
  declarations: [
    LancamentoCadastroComponent,
    LancamentosPesquisaComponent,
  ],
  exports: []
})
export class LancamentosModule { }
