import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleRoutingModule } from './post-shared-module-routing.module';
import { SharedModuleComponent } from './post-shared-module.component';
import { PostCardComponent } from './post-card/post-card.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
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
