import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {SharedModule} from '../shared/shared.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PanelModule} from 'primeng/panel';
import {ChartModule} from 'primeng/chart';


@NgModule({
  imports: [
    CommonModule,

    PanelModule,
    ChartModule,

    SharedModule,
    DashboardRoutingModule
  ],

  declarations: [DashboardComponent],
  providers: [DecimalPipe]
})
export class DashboardModule {
}
