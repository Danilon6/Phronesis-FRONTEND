import { Component } from '@angular/core';
import { IUser } from '../../models/i-user';
import { UserService } from '../../services/user.service';
import { RoleType } from '../../models/role-type';
import { MatDialog } from '@angular/material/dialog';
import { BanUserDialogComponent } from '../../mainComponents/dialogs/ban-user-dialog/ban-user-dialog.component';

@Component({
  selector: 'app-roles',
  templateUrl: './user-managment.component.html',
  styleUrl: './user-managment.component.scss'
})
export class RolesComponent {

  userArr: IUser[] = [];
  isAdmin: boolean = false;

  constructor(private userSvc: UserService, public dialogUserBan: MatDialog) {}

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
      this.userSvc.addUserRole(user.id, RoleType.ADMIN).subscribe();
    } else {
      this.userSvc.removeUserRole(user.id, RoleType.ADMIN).subscribe();
    }
  }

  toggleUserRole(user: IUser) {
    if (!this.userHasRole(user, RoleType.USER)) {
      this.userSvc.addUserRole(user.id, RoleType.USER).subscribe();
    } else {
      this.userSvc.removeUserRole(user.id, RoleType.USER).subscribe();
    }
  }

  toggleBanStatus(user: IUser) {
    console.log(user.banned);

    if (user.banned) {
      this.userSvc.unbanUser(user.id).subscribe(() =>{
        console.log(user.banned);

      });
    } else {
      this.openBanUserDialog(user.id);
      console.log(user.banned);
    }
  }

  openBanUserDialog(userId: number): void {
    const dialogRef = this.dialogUserBan.open(BanUserDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(reason => {
      if (reason) {
        this.userSvc.banUser(userId, reason).subscribe();
      }
    });
  }
}
