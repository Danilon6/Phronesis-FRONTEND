import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPostReportResponse } from '../../../models/report/i-post-report-response';
import { PostReportService } from '../../../services/post-report.service';

@Component({
  selector: 'app-post-report-card',
  templateUrl: './post-report-card.component.html',
  styleUrl: './post-report-card.component.scss'
})
export class PostReportCardComponent {
  @Input() report!: IPostReportResponse;
  @Output() viewDetails = new EventEmitter<IPostReportResponse>();
  @Output() delete = new EventEmitter<number>();

  constructor(private postReportSvc: PostReportService) {}

  onDetailClick(): void {
    this.viewDetails.emit(this.report);
  }

  deleteReport(reportId:number): void {
    this.postReportSvc.removePostReport(this.report.id).subscribe(() => {
      this.delete.emit(this.report.id);
    });
  }
}
