import { Component } from '@angular/core';
import { IAdvert } from '../../models/i-advert';
import { AdsService } from '../../services/ads.service';
import { CreateEditAdvertDialogComponent } from '../../mainComponents/dialogs/create-edit-advert-dialog/create-edit-advert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrl: './advert.component.scss'
})
export class AdvertComponent {

  advertArr: IAdvert[] = [];

  constructor(private advertSvc: AdsService, public dialog: MatDialog) {
    console.log("sono qui");

  }

  ngOnInit(): void {
    this.advertSvc.advert$.subscribe(advertArr => {
      this.advertArr = advertArr;
      console.log(advertArr);

    });
  }

  openCreateAdvertDialog(): void {
    const dialogRef = this.dialog.open(CreateEditAdvertDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.advertSvc.createAdvert(result.newAdvert, result.imageFile).subscribe();
      }
    });
  }

  openEditAdvertDialog(advert: IAdvert): void {
    const dialogRef = this.dialog.open(CreateEditAdvertDialogComponent, {
      width: '400px',
      data: { advert }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.advertSvc.updateAdvert(advert.id, result.newAdvert, result.imageFile).subscribe(updatedAdvert => {
          const index = this.advertArr.findIndex(ad => ad.id === updatedAdvert.id);
          if (index !== -1) {
            this.advertArr[index] = updatedAdvert;
            this.advertSvc.advertSubject.next(this.advertArr);
          }
        });
      }
    });
  }

  deleteAdvert(id: number): void {
    this.advertSvc.deleteAdvert(id).subscribe(() => {
      this.advertArr = this.advertArr.filter(ad => ad.id !== id);
      this.advertSvc.advertSubject.next(this.advertArr);
    });
  }

}
