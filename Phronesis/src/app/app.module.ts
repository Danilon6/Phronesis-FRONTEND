import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './mainComponents/header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AdsComponent } from './mainComponents/ads/ads.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreatePostDialogComponent } from './mainComponents/dialogs/create-post-dialog/create-post-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth.interceptor';
import { EditCommentDialogComponent } from './mainComponents/dialogs/edit-comment-dialog/edit-comment-dialog.component';
import { EditPostDialogComponent } from './mainComponents/dialogs/edit-post-dialog/edit-post-dialog.component';
import { LikeListDialogComponent } from './mainComponents/dialogs/like-list-dialog/like-list-dialog.component';
import { FollowListDialogComponent } from './mainComponents/dialogs/follow-list-dialog/follow-list-dialog.component';
import { EditUserDialogComponent } from './mainComponents/dialogs/edit-user-dialog/edit-user-dialog.component';
import { ReportDialogComponent } from './mainComponents/dialogs/report-dialog/report-dialog.component';
import { UpdatePictureComponent } from './mainComponents/dialogs/update-picture/update-picture.component';
import { ReportDetailsComponent } from './mainComponents/dialogs/report-details/report-details.component';
import { BanUserDialogComponent } from './mainComponents/dialogs/ban-user-dialog/ban-user-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreateEditAdvertDialogComponent } from './mainComponents/dialogs/create-edit-advert-dialog/create-edit-advert-dialog.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AdsComponent,
    CreatePostDialogComponent,
    EditCommentDialogComponent,
    EditPostDialogComponent,
    LikeListDialogComponent,
    FollowListDialogComponent,
    EditUserDialogComponent,
    ReportDialogComponent,
    UpdatePictureComponent,
    ReportDetailsComponent,
    BanUserDialogComponent,
    CreateEditAdvertDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    SweetAlert2Module.forRoot()  // Importa SweetAlert2
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
