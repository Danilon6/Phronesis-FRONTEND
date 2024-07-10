import { Component } from '@angular/core';
import { IAdvert } from '../../models/i-advert';
import { AdsService } from '../../services/ads.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { UpdatePictureComponent } from '../../mainComponents/dialogs/update-picture/update-picture.component';
import { EditAdvertDialogComponent } from '../../mainComponents/dialogs/edit-advert-dialog/edit-advert-dialog.component';

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.scss']
})
export class AdvertComponent {
  advertArr: IAdvert[] = [];
  showCreateAdvertForm = false;
  hideCreateAdvertForm = false;
  advertRequest = { title: '', description: '' };
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private advertSvc: AdsService,
    public dialog: MatDialog,
    private notificationSvc:NotificationService) {}

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
      this.advertSvc.createAdvert(this.advertRequest, this.selectedFile).subscribe(advert => {
        this.advertRequest = { title: '', description: '' };
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
          }
        });
      }
    });
  }

  openImageUploadModal(advert:IAdvert): void {
    const dialogRef = this.dialog.open(UpdatePictureComponent, {
      width: '400px',
      data: { currentImage: advert.imageUrl, title: 'Aggiorna Immagine Annuncio' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the user's profile picture
        this.advertSvc.updateAdvertImage(advert.id, result).subscribe(updatedAdvert => {
          advert.imageUrl = updatedAdvert.imageUrl;
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
