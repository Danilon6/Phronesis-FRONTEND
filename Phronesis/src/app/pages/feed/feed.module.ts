import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';
import { AddPostComponent } from './add-post/add-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';


@NgModule({
  declarations: [
    FeedComponent,
    AddPostComponent,
    EditPostComponent
  ],
  imports: [
    CommonModule,
    FeedRoutingModule
  ]
})
export class FeedModule { }
