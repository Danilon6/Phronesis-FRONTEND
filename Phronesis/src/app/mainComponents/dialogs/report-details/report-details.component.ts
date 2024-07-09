import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IUserReportResponse } from '../../../models/report/i-user-report-response';
import { IPostReportResponse } from '../../../models/report/i-post-report-response';
import { UserReportService } from '../../../services/user-report.service';
import { PostReportService } from '../../../services/post-report.service';
import { UserService } from '../../../services/user.service';
import { PostService } from '../../../services/post.service';
import { BanUserDialogComponent } from '../ban-user-dialog/ban-user-dialog.component';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.scss'
})
export class ReportDetailsComponent {
  report: IUserReportResponse | IPostReportResponse;
  type: 'user' | 'post';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { report: IUserReportResponse | IPostReportResponse, type: 'user' | 'post' },
    public dialogRef: MatDialogRef<ReportDetailsComponent>,
    public dialogUserBan: MatDialog,
    private userSvc: UserService,
    private postSvc: PostService,
    private notificationSvc: NotificationService
  ) {
    this.report = data.report;
    this.type = data.type;
  }

  isUserReport(report: IUserReportResponse | IPostReportResponse): report is IUserReportResponse {
    return 'reportedUser' in report;
  }

  isPostReport(report: IUserReportResponse | IPostReportResponse): report is IPostReportResponse {
    return 'reportedPost' in report;
  }

  openBanUserDialog(userId: number): void {
    const dialogRef = this.dialogUserBan.open(BanUserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(reason => {
      if (reason) {
        this.notificationSvc.confirm('Sei sicuro di voler bannare questo utente?').then(result => {
          if (result.isConfirmed) {
            this.userSvc.banUser(userId, reason).subscribe(() => {
              this.notificationSvc.notify('Utente bannato con successo', 'success');
              this.dialogRef.close('refresh');
            });
          }
        });
      }
    });
  }

  unbanUser(userId: number): void {
    this.notificationSvc.confirm('Sei sicuro di voler sbannare questo utente?').then(result => {
      if (result.isConfirmed) {
        this.userSvc.unbanUser(userId).subscribe(() => {
          this.notificationSvc.notify('Utente sbannato con successo', 'success');
          this.dialogRef.close('refresh');
        });
      }
    });
  }

  deletePost(postId: number): void {
    this.notificationSvc.confirm('Sei sicuro di voler eliminare questa seganlazione e il post?').then(result => {
      if (result.isConfirmed) {
        this.postSvc.delete(postId).subscribe(() => {
          this.notificationSvc.notify('Post e segnalazione eliminati con successo', 'success');
          this.dialogRef.close('refresh');
        });
      }
    });
  }
}
