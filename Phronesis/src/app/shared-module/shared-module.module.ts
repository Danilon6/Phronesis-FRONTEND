import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleRoutingModule } from './shared-module-routing.module';
import { SharedModuleComponent } from './shared-module.component';
import { PostCardComponent } from './post-card/post-card.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SharedModuleComponent,
    PostCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModuleRoutingModule
  ],
  exports: [
    PostCardComponent
  ]
})
export class SharedModuleModule { }
