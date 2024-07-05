import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './user-managment-routing.module';
import { RolesComponent } from './user-managment.component';


@NgModule({
  declarations: [
    RolesComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule
  ]
})
export class RolesModule { }
