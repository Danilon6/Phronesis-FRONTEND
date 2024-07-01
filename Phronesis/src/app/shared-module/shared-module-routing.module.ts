import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModuleComponent } from './shared-module.component';

const routes: Routes = [{ path: '', component: SharedModuleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedModuleRoutingModule { }
