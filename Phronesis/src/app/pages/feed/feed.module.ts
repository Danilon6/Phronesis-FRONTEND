import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { FeedComponent } from './feed.component';
import { AddPostComponent } from './add-post/add-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FeedComponent,
    AddPostComponent,
    EditPostComponent
  ],
  imports: [
    CommonModule,
    FeedRoutingModule,
    FormsModule
  ]
})
export class FeedModule { }
