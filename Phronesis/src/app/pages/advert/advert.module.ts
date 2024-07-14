import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvertRoutingModule } from './advert-routing.module';
import { AdvertComponent } from './advert.component';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  declarations: [
    AdvertComponent
  ],
  imports: [
    CommonModule,
    AdvertRoutingModule,
    FormsModule,
    ScrollingModule
  ]
})
export class AdvertModule { }
