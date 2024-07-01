import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { LoginComponent } from './Login/login/login.component';
import { LoginService } from './Login/login/login.service';
import { PrListComponent } from './PR/pr-list/pr-list.component';
import { PrViewComponent } from './PR/pr-view/pr-view.component';
import { PrCreateComponent } from './PR/pr-create/pr-create.component';
import { NgToastModule } from 'ng-angular-popup';
import { CommonServiceService } from './PR/Services/common-service.service';
import { ManagmentComponent } from './PR/managment/managment.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AuthGuard } from './shared/Auth/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,

    LoginComponent,
    PrListComponent,
    PrViewComponent,
    PrCreateComponent,
    ManagmentComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, //formGroup //formControl
    NgToastModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'prlist', component: PrListComponent, canActivate: [AuthGuard] },
      { path: 'prview', component: PrViewComponent, canActivate: [AuthGuard] },
      { path: 'prcreate', component: PrCreateComponent, canActivate: [AuthGuard] },
      { path: 'managment', component: ManagmentComponent, canActivate: [AuthGuard] }
    ])
  ],
  providers: [LoginService, CommonServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
