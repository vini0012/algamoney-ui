import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";

import {AppComponent} from './app.component';
import {CoreModule} from "./core/core.module";

import localePt from '@angular/common/locales/pt';
import {registerLocaleData} from '@angular/common';
import {ToastModule} from "primeng/toast";
import {AppRoutingModule} from "./app-routing.module";
import {NgModule} from "@angular/core";
import {SegurancaModule} from "./seguranca/seguranca.module";

registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastModule,

    CoreModule,
    SegurancaModule,
    AppRoutingModule,
  ],
  providers: [
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
