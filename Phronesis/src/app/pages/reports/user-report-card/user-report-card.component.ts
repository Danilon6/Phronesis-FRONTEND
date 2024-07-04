import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUserReportResponse } from '../../../models/report/i-user-report-response';
import { MatDialog } from '@angular/material/dialog';
import { UserReportService } from '../../../services/user-report.service';

@Component({
  selector: 'app-user-report-card',
  templateUrl: './user-report-card.component.html',
  styleUrl: './user-report-card.component.scss'
})
export class UserReportCardComponent {
  @Input() report!: IUserReportResponse;
  @Output() viewDetails = new EventEmitter<IUserReportResponse>();
  @Output() delete = new EventEmitter<number>();

  constructor(
    private dialog: MatDialog,
    private userReportSvc: UserReportService
  ) {}

  onDetailClick(): void {
    this.viewDetails.emit(this.report);
  }

  deleteReport(reportId:number): void {
    this.userReportSvc.removeUserReport(this.report.id).subscribe(() => {
      this.delete.emit(this.report.id);
    });
  }
}
