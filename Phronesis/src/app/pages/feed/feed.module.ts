import { SharedModuleModule } from '../../sharedModule/post-shared-module/post-shared-module.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';



@NgModule({
  declarations: [
    FeedComponent,
  ],
  imports: [
    CommonModule,
    FeedRoutingModule,
    FormsModule,
    SharedModuleModule,
    ScrollingModule
  ]
})
export class FeedModule { }
