import { Component } from '@angular/core';
import { IAdvert } from '../../models/i-advert';
import { AdsService } from '../../services/ads.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { UpdatePictureComponent } from '../../mainComponents/dialogs/update-picture/update-picture.component';
import { EditAdvertDialogComponent } from '../../mainComponents/dialogs/edit-advert-dialog/edit-advert-dialog.component';
import { AuthService } from '../../auth/auth.service';
import { IAdvertRequest } from '../../models/i-advert-request';




@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.scss']
})
export class AdvertComponent {
  advertArr: IAdvert[] = [];
  showCreateAdvertForm = false;
  hideCreateAdvertForm = false;
  advertRequest:IAdvertRequest = {title: "", description:"", createdById: null}
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private advertSvc: AdsService,
    public dialog: MatDialog,
    private notificationSvc: NotificationService,
  private authSvc:AuthService) {}

  ngOnInit(): void {
    this.advertSvc.advert$.subscribe(advertArr => {
      this.advertArr = advertArr;
    });
  }

  toggleCreateAdvertForm(): void {
    if (this.showCreateAdvertForm) {
      this.hideCreateAdvertForm = true;
      setTimeout(() => {
        this.showCreateAdvertForm = false;
        this.hideCreateAdvertForm = false;
      }, 500);
    } else {
      this.showCreateAdvertForm = true;
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  createAdvert(): void {
    if (this.selectedFile) {
      this.advertRequest.createdById = this.authSvc.getCurrentUserId()
      this.advertSvc.createAdvert(this.advertRequest, this.selectedFile).subscribe(() => {
        this.advertRequest = {title:"", description:"", createdById: null}
        this.imagePreview = null;
        this.selectedFile = null;
        this.notificationSvc.notify('Annuncio creato con successo!', 'success');
        this.toggleCreateAdvertForm();
      });
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    fileInput.click();
  }

  openEditAdvertDialog(advert: IAdvert): void {
    const dialogRef = this.dialog.open(EditAdvertDialogComponent, {
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
            this.notificationSvc.notify('Annuncio aggiornato con successo!', 'success');
          }
        });
      }
    });
  }

  openImageUploadModal(advert: IAdvert): void {
    const dialogRef = this.dialog.open(UpdatePictureComponent, {
      width: '400px',
      data: { currentImage: advert.imageUrl, title: 'Aggiorna Immagine Annuncio' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.advertSvc.updateAdvertImage(advert.id, result).subscribe(updatedAdvert => {
          advert.imageUrl = updatedAdvert.imageUrl;
          this.notificationSvc.notify('Immagine aggiornata con successo!', 'success');
        });
      }
    });
  }

  deleteAdvert(id: number): void {
    this.notificationSvc.confirm('Sei sicuro di voler eliminare questo annuncio?').then(result => {
      if (result.isConfirmed) {
        this.advertSvc.deleteAdvert(id).subscribe(() => {
          this.advertArr = this.advertArr.filter(ad => ad.id !== id);
          this.advertSvc.advertSubject.next(this.advertArr);
          this.notificationSvc.notify('Annuncio eliminato con successo!', 'success');
        });
      }
    });
  }
}
