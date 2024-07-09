import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUserReportResponse } from '../../../models/report/i-user-report-response';
import { MatDialog } from '@angular/material/dialog';
import { UserReportService } from '../../../services/user-report.service';
import { NotificationService } from '../../../services/notification.service';

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
    private userReportSvc: UserReportService,
    private notificationSvc: NotificationService
  ) {}

  onDetailClick(): void {
    this.viewDetails.emit(this.report);
  }

  deleteReport(): void {
    // this.notificationSvc.confirm('Sei sicuro di voler eliminare questo report utente?').then(result => {
    //   if (result.isConfirmed) {
        this.userReportSvc.removeUserReport(this.report.id).subscribe(() => {
          this.delete.emit(this.report.id);
          this.notificationSvc.notify('Report utente eliminato con successo', 'success');
        });
      // }
    // });
  }
}
