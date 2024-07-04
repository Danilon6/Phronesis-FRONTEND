import { Component } from '@angular/core';
import { IUserReportResponse } from '../../models/report/i-user-report-response';
import { IPostReportResponse } from '../../models/report/i-post-report-response';
import { UserReportService } from '../../services/user-report.service';
import { PostReportService, } from '../../services/post-report.service';
import { MatDialog } from '@angular/material/dialog';
import { ReportDetailsComponent } from '../../mainComponents/dialogs/report-details/report-details.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  userReports: IUserReportResponse[] = [];
  postReports: IPostReportResponse[] = [];

  constructor(
    private userReportSvc: UserReportService,
    private postReportSvc: PostReportService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.userReportSvc.getAllUserReports().subscribe(reports => {
      this.userReports = reports;
      console.log(reports);

    });

    this.postReportSvc.getAllpostReports().subscribe(reports => {
      this.postReports = reports;
      console.log(reports);
    });
  }

  openReportDetail(report: IUserReportResponse | IPostReportResponse, type: 'user' | 'post'): void {
    console.log(report);

    const dialogRef = this.dialog.open(ReportDetailsComponent, {
      width: '600px',
      data: { report, type }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.loadReports();
      }
    });
  }

  onUserReportDeleted(reportId: number): void {
    this.userReports = this.userReports.filter(report => report.id !== reportId);
  }

  onPostReportDeleted(reportId: number): void {
    this.postReports = this.postReports.filter(report => report.id !== reportId);
  }
}
