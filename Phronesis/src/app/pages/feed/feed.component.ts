import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { IPost } from '../../models/i-post';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';
import { FavoriteService } from '../../services/favorite.service';
import { IFavorite } from '../../models/i-favorite';
import { IPostRequest } from '../../models/i-post-request';
import { IUser } from '../../models/i-user';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  postArr: IPost[] = [];
  favoriteArr: IFavorite[] = [];
  currentUserId: number | null;
  user!:Partial<IUser> | null
  showCreatePostForm: boolean = false;
  hideCreatePostForm: boolean = false;


  postRequest:IPostRequest = {
    title: "",
    content:"",
    userId: null
  }

  constructor(
    private dialog: MatDialog,
    private postSvc: PostService,
    private authSvc: AuthService,
    private favoriteSvc: FavoriteService,
    private notificationSvc:NotificationService
  ) {
    this.currentUserId = this.authSvc.getCurrentUserId();
    this.authSvc.$user.subscribe(user=>{
      this.user = user
    })
  }

  toggleCreatePostForm() {
    if (this.showCreatePostForm) {
      this.hideCreatePost();
    } else {
      this.showCreatePostForm = true;
    }
  }

  hideCreatePost() {
    this.hideCreatePostForm = true;
    setTimeout(() => {
      this.showCreatePostForm = false;
      this.hideCreatePostForm = false;
    }, 500);
  }

  ngOnInit(): void {
    this.postSvc.getAll().subscribe(postArr =>{
        this.postArr = postArr;
    })
    if (this.currentUserId) {
      this.favoriteSvc.getAllByUserId(this.currentUserId).subscribe(favorites => {
        this.favoriteArr = favorites;
      });
    }
  }


  createPost(): void {
    if (!this.postRequest.title.trim() || !this.postRequest.content.trim()) return;

    const postRequest: IPostRequest = {
      title: this.postRequest.title,
      content: this.postRequest.content,
      userId: this.currentUserId as number
    };

    this.postSvc.addPost(postRequest).subscribe(() =>{
      this.notificationSvc.notify('Post creato con successo', 'success');
      this.resetPostRequest();
      this.hideCreatePost();
    });
  }

  private resetPostRequest(): void {
    this.postRequest = {
      title: "",
      content: "",
      userId: this.currentUserId
    };
  }
}
