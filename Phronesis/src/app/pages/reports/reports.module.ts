import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { UserReportCardComponent } from './user-report-card/user-report-card.component';
import { PostReportCardComponent } from './post-report-card/post-report-card.component';
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  declarations: [
    ReportsComponent,
    UserReportCardComponent,
    PostReportCardComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ScrollingModule
  ]
})
export class ReportsModule { }
