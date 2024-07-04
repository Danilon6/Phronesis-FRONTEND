import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { IPost } from '../../models/i-post';
import { CreatePostDialogComponent } from '../../mainComponents/dialogs/create-post-dialog/create-post-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';
import { FavoriteService } from '../../services/favorite.service';
import { IFavorite } from '../../models/i-favorite';
import { IPostRequest } from '../../models/i-post-request';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  postArr: IPost[] = [];
  favoriteArr: IFavorite[] = [];
  currentUserId: number | null;

  constructor(
    private dialog: MatDialog,
    private postSvc: PostService,
    private authSvc: AuthService,
    private favoriteSvc: FavoriteService
  ) {
    this.currentUserId = this.authSvc.getCurrentUserId();
  }

  ngOnInit(): void {
    this.postSvc.post$.subscribe(postArr => {
      this.postArr = postArr;
    });

    if (this.currentUserId) {
      this.favoriteSvc.getAllByUserId(this.currentUserId).subscribe(favorites => {
        this.favoriteArr = favorites;
      });
    }
  }

  openCreatePostDialog(): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const postRequest:IPostRequest = {
          title: result.title,
          content: result.content,
          userId: this.currentUserId as number
        };

        this.postSvc.addPost(postRequest).subscribe();
      }
    });
  }

}
