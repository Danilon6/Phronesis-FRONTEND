import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EnableComponent } from './components/enable/enable.component';
import { FormsModule } from '@angular/forms';
import { RequestNewVerificationLinkComponent } from './components/request-new-verification-token/request-new-verification-link.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    EnableComponent,
    RequestNewVerificationLinkComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule
  ]
})
export class AuthModule { }
