import { SharedModuleModule } from '../../shared-module/shared-module.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FeedComponent,
  ],
  imports: [
    CommonModule,
    FeedRoutingModule,
    FormsModule,
    SharedModuleModule
  ]
})
export class FeedModule { }
