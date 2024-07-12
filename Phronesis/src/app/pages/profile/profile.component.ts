import { Component } from '@angular/core';
import { IUser } from '../../models/i-user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { IPost } from '../../models/i-post';
import { PostService } from '../../services/post.service';
import { LikeService } from '../../services/like.service';
import { FavoriteService } from '../../services/favorite.service';
import { IFavorite } from '../../models/i-favorite';
import { ILike } from '../../models/i-like';
import { map } from 'rxjs';
import { FollowService } from '../../services/follow.service';
import { IFollowResponse } from '../../models/i-follow-response';
import { MatDialog } from '@angular/material/dialog';
import { FollowListDialogComponent } from '../../mainComponents/dialogs/follow-list-dialog/follow-list-dialog.component';
import { EditUserDialogComponent } from '../../mainComponents/dialogs/edit-user-dialog/edit-user-dialog.component';
import { ReportDialogComponent } from '../../mainComponents/dialogs/report-dialog/report-dialog.component';
import { IUserReportRequest } from '../../models/report/i-user-report-request';
import { UserReportService } from '../../services/user-report.service';
import { UpdatePictureComponent } from '../../mainComponents/dialogs/update-picture/update-picture.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user!: IUser;
  userPosts: IPost[] = [];
  likedPosts: IPost[] = [];
  favoritePosts: IPost[] = [];
  selectedSection: 'posts' | 'likedPosts' | 'favoritePosts' | '' = 'posts';
  isFollowing: boolean = false;
  currentUserId!: number;
  isOtherUser: boolean = false;
  followersCount: number = 0;
  followingCount: number = 0;
  followersList: IFollowResponse[] = [];
  followingList: IFollowResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private userSvc: UserService,
    private postSvc: PostService,
    private likeSvc: LikeService,
    private notificationSvc:NotificationService,
    private favoriteSvc: FavoriteService,
    private followSvc: FollowService,
    private userReportSvc: UserReportService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.currentUserId = this.authSvc.getCurrentUserId() as number;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = +params['userId'];

      if (userId) {
        this.userSvc.getUserById(userId).subscribe(user => {
          this.user = user;
          this.isOtherUser = user.id !== this.currentUserId;
          if (this.isOtherUser) {
            this.checkIfFollowing();
          }
          this.loadFollowCounts();

          // Update posts based on the selected section
          this.route.queryParams.subscribe(queryParams => {
            this.selectedSection = queryParams['section'] || 'posts';
            this.updatePosts();
          });
        });
      }
    });

    this.postSvc.post$.subscribe(posts => {

      if (this.selectedSection === 'posts') {
        this.userPosts = posts;
      } else if (this.selectedSection === 'likedPosts') {
        this.likedPosts = posts;
      } else if (this.selectedSection === 'favoritePosts') {
        this.favoritePosts = posts;
      }
    });
  }

  checkIfFollowing(): void {
    this.followSvc.isFollowing(this.currentUserId, this.user.id).subscribe(isFollowing => {
      this.isFollowing = isFollowing;
    });
  }

  toggleFollow(): void {
    if (this.isFollowing) {
      this.followSvc.unfollow(this.currentUserId, this.user.id).subscribe(() => {
        this.isFollowing = false;
        this.loadFollowCounts();
      });
    } else {
      this.followSvc.follow(this.currentUserId, this.user.id).subscribe(() => {
        this.isFollowing = true;
        this.loadFollowCounts();
      });
    }
  }

  loadUserPosts(): void {
    if (this.user) {
      this.postSvc.getPostsByUserId(this.user.id).subscribe(posts => {
        this.postSvc.postSubject.next(posts);
      });
    }
  }

  loadLikedPosts(): void {
    if (this.user) {
      this.likeSvc.getLikedPostsByUserId(this.user.id).pipe(
        map((likes: ILike[]) => likes.map(like => like.post))
      ).subscribe(posts => {
        this.postSvc.postSubject.next(posts);
      });
    }
  }

  loadFavoritePosts(): void {
    if (this.user) {
      this.favoriteSvc.getAllByUserId(this.user.id).pipe(
        map((favorites: IFavorite[]) => favorites.map(favorite => favorite.post))
      ).subscribe(posts => {
        this.postSvc.postSubject.next(posts);
      });
    }
  }

  loadFollowCounts(): void {
    this.followSvc.getFollowers(this.user.id).subscribe(followers => {
      this.followersCount = followers.length;
      this.followersList = followers;
      console.log(this.followersList);

    });
    this.followSvc.getFollowing(this.user.id).subscribe(following => {
      this.followingCount = following.length;
      this.followingList = following;
    });
  }

  editProfile(): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      data: { user: this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const editedUser:Partial<IUser> = {
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          bio: result.bio
        };
        this.userSvc.updateUser(result.id, editedUser).subscribe(updatedUser => {
          this.user = updatedUser;
        });
      }
    });
  }

  deleteProfile(userId:number):void {
    this.userSvc.deleteUser(userId).subscribe()
  }

  openFollowersModal(): void {
    this.dialog.open(FollowListDialogComponent, {
      width: '400px',
      data: { title: 'Followers', list: this.followersList, key: "follower" }
    });
  }

  openFollowingModal(): void {
    this.dialog.open(FollowListDialogComponent, {
      width: '400px',
      data: { title: 'Following', list: this.followingList, key: "following" }
    });
  }

  viewUserPosts(): void {
    this.selectedSection = 'posts';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: 'posts' },
      queryParamsHandling: 'merge'
    });
    this.loadUserPosts();
  }

  viewLikedPosts(): void {
    this.selectedSection = 'likedPosts';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: 'likedPosts' },
      queryParamsHandling: 'merge'
    });
    this.loadLikedPosts();
  }

  viewFavoritePosts(): void {
    this.selectedSection = 'favoritePosts';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { section: 'favoritePosts' },
      queryParamsHandling: 'merge'
    });
    this.loadFavoritePosts();
  }

  updatePosts(): void {
    if (this.selectedSection === 'posts') {
      this.loadUserPosts();
    } else if (this.selectedSection === 'likedPosts') {
      this.loadLikedPosts();
    } else if (this.selectedSection === 'favoritePosts') {
      this.loadFavoritePosts();
    }
  }


  reportUser(userId: number): void {
  this.notificationSvc.confirm('Sei sicuro di voler segnalare questo utente?').then(result => {
    if (result.isConfirmed) {
      const dialogRef = this.dialog.open(ReportDialogComponent, {
        width: '300px',
        data: { reportType: 'user' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const reportRequest: IUserReportRequest = {
            reportedById: this.currentUserId as number,
            reportedUserId: userId,
            reason: result.reason
          };
          this.userReportSvc.addUserReport(reportRequest).subscribe(() => {
            this.notificationSvc.notify('Utente segnalato con successo!', 'success');
          });
        }
      });
    }
  });
}

  openImageUploadModal(): void {
    const dialogRef = this.dialog.open(UpdatePictureComponent, {
      width: '400px',
      data: { currentImage: this.user.profilePicture, title: 'Aggiorna Immagine Profilo' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the user's profile picture
        this.userSvc.updateProfilePicture(this.user.id, result).subscribe(updatedUser => {
          this.user.profilePicture = updatedUser.profilePicture;
          this.updatePosts();
        });
      }
    });
  }
}

