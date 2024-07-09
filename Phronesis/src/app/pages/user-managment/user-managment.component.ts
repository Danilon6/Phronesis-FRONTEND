import { Component } from '@angular/core';
import { IUser } from '../../models/i-user';
import { UserService } from '../../services/user.service';
import { RoleType } from '../../models/role-type';
import { MatDialog } from '@angular/material/dialog';
import { BanUserDialogComponent } from '../../mainComponents/dialogs/ban-user-dialog/ban-user-dialog.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-roles',
  templateUrl: './user-managment.component.html',
  styleUrl: './user-managment.component.scss'
})
export class RolesComponent {

  userArr: IUser[] = [];
  isAdmin: boolean = false;

  constructor(private userSvc: UserService, public dialogUserBan: MatDialog, private notificationSvc: NotificationService) {}

  ngOnInit() {
    this.userSvc.user$.subscribe(users => {
      this.userArr = users;
    });
  }

  userHasRole(user: IUser, role: string): boolean {
    return user.roles.some(r => r.roleType === role);
  }

  toggleAdminRole(user: IUser) {
    if (!this.userHasRole(user, RoleType.ADMIN)) {
      this.notificationSvc.confirm('Sei sicuro di voler aggiungere il ruolo di admin?').then(result => {
        if (result.isConfirmed) {
          this.userSvc.addUserRole(user.id, RoleType.ADMIN).subscribe(() => {
            this.notificationSvc.notify('Ruolo di admin aggiunto con successo', 'success');
          });
        }
      });
    } else {
      this.notificationSvc.confirm('Sei sicuro di voler rimuovere il ruolo di admin?').then(result => {
        if (result.isConfirmed) {
          this.userSvc.removeUserRole(user.id, RoleType.ADMIN).subscribe(() => {
            this.notificationSvc.notify('Ruolo di admin rimosso con successo', 'success');
          });
        }
      });
    }
  }

  toggleUserRole(user: IUser) {
    if (!this.userHasRole(user, RoleType.USER)) {
      this.notificationSvc.confirm('Sei sicuro di voler aggiungere il ruolo di utente?').then(result => {
        if (result.isConfirmed) {
          this.userSvc.addUserRole(user.id, RoleType.USER).subscribe(() => {
            this.notificationSvc.notify('Ruolo di utente aggiunto con successo', 'success');
          });
        }
      });
    } else {
      this.notificationSvc.confirm('Sei sicuro di voler rimuovere il ruolo di utente?').then(result => {
        if (result.isConfirmed) {
          this.userSvc.removeUserRole(user.id, RoleType.USER).subscribe(() => {
            this.notificationSvc.notify('Ruolo di utente rimosso con successo', 'success');
          });
        }
      });
    }
  }

  toggleBanStatus(user: IUser) {
    if (user.banned) {
      this.notificationSvc.confirm('Sei sicuro di voler sbannare questo utente?').then(result => {
        if (result.isConfirmed) {
          this.userSvc.unbanUser(user.id).subscribe(() => {
            this.notificationSvc.notify('Utente sbannato con successo', 'success');
          });
        }
      });
    } else {
      this.notificationSvc.confirm('Sei sicuro di voler bannare questo utente?').then(result => {
        if (result.isConfirmed) {
          this.openBanUserDialog(user.id);
        }
      });
    }
  }

  openBanUserDialog(userId: number): void {
    const dialogRef = this.dialogUserBan.open(BanUserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(reason => {
      if (reason) {
        this.userSvc.banUser(userId, reason).subscribe(() => {
          this.notificationSvc.notify('Utente bannato con successo', 'success');
        });
      }
    });
  }
}
