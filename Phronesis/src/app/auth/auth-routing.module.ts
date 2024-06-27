import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EnableComponent } from './components/enable/enable.component';
import { RequestNewVerificationLinkComponent } from './components/request-new-verification-token/request-new-verification-link.component';

const routes: Routes = [
  {
    path:'register',
    component: RegisterComponent,
    title:'Register'
  },
  {
    path:'login',
    component: LoginComponent,
    title:'Login'
  },
  {
    path:'enable',
    component: EnableComponent,
    title:'Enable'
  },
  {
    path:'request-new-verification-link',
    component: RequestNewVerificationLinkComponent,
    title:'New Verification Link'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
