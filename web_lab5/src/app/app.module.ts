import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StockComponent} from "./stock/stock.component";
import { SettingsComponent} from "./settings/settings.component";
import { BrokerComponent} from "./broker/broker.component";
import { NavbarComponent} from "./navbar/navbar.component";
import { BoldDirective } from "./bold.directive";

const appRoutes: Routes = [
  { path: 'trade', component: StockComponent},
  { path: 'broker', component: BrokerComponent},
  { path: 'setts', component: SettingsComponent},
];
@NgModule({
  declarations: [
    AppComponent, SettingsComponent, BrokerComponent,
    StockComponent, NavbarComponent,BoldDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [NavbarComponent]
})

export class AppModule { }
