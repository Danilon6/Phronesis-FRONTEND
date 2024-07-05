import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { PostCardComponent } from './post-card/post-card.component';
import { FormsModule } from '@angular/forms';
import { SharedModuleRoutingModule } from './post-shared-module-routing.module';


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
