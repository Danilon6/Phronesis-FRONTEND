import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../auth/auth.service';
import { CommentService } from '../../../services/comment.service';
import { LikeService } from '../../../services/like.service';
import { FavoriteService } from '../../../services/favorite.service';
import { IFavorite } from '../../../models/i-favorite';
import { IPost } from '../../../models/i-post';
import { EditPostDialogComponent } from '../../../mainComponents/dialogs/edit-post-dialog/edit-post-dialog.component';
import { EditCommentDialogComponent } from '../../../mainComponents/dialogs/edit-comment-dialog/edit-comment-dialog.component';
import { IComment } from '../../../models/i-comment';
import { ICommentRequest } from '../../../models/i-comment-request';
import { ILike } from '../../../models/i-like';
import { IUserPostInteractionRequest } from '../../../models/i-user-post-interaction-request';
import { LikeListDialogComponent } from '../../../mainComponents/dialogs/like-list-dialog/like-list-dialog.component';
import { IUser } from '../../../models/i-user';
import { ReportDialogComponent } from '../../../mainComponents/dialogs/report-dialog/report-dialog.component';
import { IUserReportRequest } from '../../../models/report/i-user-report-request';
import { UserReportService } from '../../../services/user-report.service';
import { PostReportService } from '../../../services/post-report.service';
import { IPostReportRequest } from '../../../models/report/i-post-report-request';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss'
})
export class PostCardComponent {
  @Input() post!: IPost;
  @Input() currentUserId!: number | null;

  showComments: { [key: number]: boolean } = {};
  newComment: { content: string } = { content: '' };
  postArr: IPost[] = [];
  favoriteArr: IFavorite[] = [];

  constructor(private dialog: MatDialog,
              private postSvc: PostService,
              private authSvc: AuthService,
              private commentSvc: CommentService,
              private likeSvc: LikeService,
              private favoriteSvc: FavoriteService,
              private userReportSvc: UserReportService,
              private postReportSvc: PostReportService,
              private notificationSvc: NotificationService) {}

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

  // ELIMINAZIONE DEL POST
  deletePost(postId: number) {
    this.notificationSvc.confirm('Sei sicuro di voler eliminare questo post?').then(result => {
      if (result.isConfirmed) {
        this.postSvc.delete(postId).subscribe(() => {
          this.notificationSvc.notify('Post eliminato con successo', 'success');
        });
      }
    });
  }

  // GESTIONE DEI DIALOGS

  openEditPostDialog(post: IPost): void {
    const dialogRef = this.dialog.open(EditPostDialogComponent, {
      width: '600px',
      data: { post }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationSvc.confirm('Sei sicuro di voler modificare questo post?').then(confirmResult => {
          if (confirmResult.isConfirmed) {
            const editedPost: Partial<IPost> = { title: result.title, content: result.content };
            this.postSvc.update(post.id, editedPost).subscribe(postUpdated => {
              this.notificationSvc.notify(`Post: '${post.title}' modificato con successo`, 'success');
            });
          }
        });
      }
    });
  }

  openEditCommentDialog(comment: IComment, postId: number): void {
    const dialogRef = this.dialog.open(EditCommentDialogComponent, {
      width: '250px',
      data: { comment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationSvc.confirm('Sei sicuro di voler modificare questo commento?').then(confirmResult => {
          if (confirmResult.isConfirmed) {
            const editedComment = { ...comment, content: result.content };
            this.commentSvc.update(editedComment).subscribe(updatedComment => {
              const postIndex = this.postArr.findIndex(p => p.id === postId);
              if (postIndex !== -1) {
                const commentIndex = this.postArr[postIndex].comments.findIndex(c => c.id === updatedComment.id);
                if (commentIndex !== -1) {
                  this.postArr[postIndex].comments[commentIndex] = updatedComment;
                  this.notificationSvc.notify('Commento modificato con successo', 'success');
                }
              }
            });
          }
        });
      }
    });
  }

  // GESTIONE DEI COMMENTI
  toggleComments(post: IPost): void {
    const postId = post.id;
    if (!this.showComments[postId]) {
      this.showComments[postId] = true;
      this.commentSvc.getAllByPostId(postId).subscribe(comments => {
        post.comments = comments;
      });
    } else {
      this.showComments[postId] = false;
    }
  }

  addComment(post: IPost) {
    const newCommentRequest: ICommentRequest = {
      content: this.newComment.content,
      postId: post.id,
      userId: this.currentUserId as number
    };
    this.commentSvc.addComment(newCommentRequest).subscribe(comment => {
      post.comments.push(comment);
      this.newComment.content = '';
    });
  }

  deleteComment(commentId: number, post: IPost) {
    this.notificationSvc.confirm('Sei sicuro di voler eliminare questo commento?').then(result => {
      if (result.isConfirmed) {
        this.commentSvc.delete(commentId).subscribe(() => {
          post.comments = post.comments.filter(comment => comment.id !== commentId);
          this.notificationSvc.notify('Commento eliminato con successo', 'success');
        });
      }
    });
  }

  hasUserLiked(post: IPost): boolean {
    return post.likes && post.likes.some((like: ILike) => like.user.id === this.currentUserId);
  }

  toggleLike(post: IPost): void {
    if (this.hasUserLiked(post)) {
      const likeId = post.likes.find((like: ILike) => like.user.id === this.currentUserId)?.id;
      if (likeId) {
        this.likeSvc.delete(likeId).subscribe(() => {
          post.likes = post.likes.filter(like => like.id !== likeId);
        });
      }
    } else {
      const newLike: IUserPostInteractionRequest = {
        postId: post.id,
        userId: this.currentUserId as number
      };
      this.likeSvc.addLike(newLike).subscribe(like => {
        if (!post.likes) {
          post.likes = [];
        }
        post.likes.push(like as ILike);
      });
    }
  }

  viewLikes(post: IPost): void {
    this.likeSvc.getAllLikesByPostId(post.id).subscribe(likes => {
      this.dialog.open(LikeListDialogComponent, {
        width: '400px',
        data: { likes }
      });
    });
  }

  isFavorite(postId: number): boolean {
    return this.favoriteArr.some(favorite => favorite.post.id === postId && favorite.user.id === this.currentUserId);
  }

  toggleFavorite(post: IPost): void {
    const postId = post.id;
    const userId = this.currentUserId as number;

    if (this.isFavorite(postId)) {
      const favorite = this.favoriteArr.find(fav => fav.post.id === postId && fav.user.id === userId);
      if (favorite) {
        this.favoriteSvc.removeFromFavorite(favorite.id).subscribe(() => {
          this.favoriteArr = this.favoriteArr.filter(fav => fav.id !== favorite.id);
        });
      }
    } else {
      const newFavorite: IUserPostInteractionRequest = {
        postId: postId,
        userId: userId
      };
      this.favoriteSvc.addToFavorite(newFavorite).subscribe(favorite => {
        this.favoriteArr.push(favorite as IFavorite);
      });
    }
  }

  reportPost(postId: number): void {
    this.notificationSvc.confirm('Sei sicuro di voler segnalare questo post?').then(result => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(ReportDialogComponent, {
          width: '300px',
          data: { reportType: 'post'}
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
            const reportRequest: IPostReportRequest = {
              reportedById: this.currentUserId as number,
              reportedPostId: postId,
              reason: dialogResult.reason
            };
            this.postReportSvc.addPostReport(reportRequest).subscribe(() => {
              this.notificationSvc.notify('Post segnalato con successo', 'success');
            });
          }
        });
      }
    });
  }

  reportUser(userId: number): void {
    this.notificationSvc.confirm('Sei sicuro di voler segnalare questo utente?').then(result => {
      if (result.isConfirmed) {
        const dialogRef = this.dialog.open(ReportDialogComponent, {
          width: '300px',
          data: { reportType: 'user'}
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
            const reportRequest: IUserReportRequest = {
              reportedById: this.currentUserId as number,
              reportedUserId: userId,
              reason: dialogResult.reason
            };
            this.userReportSvc.addUserReport(reportRequest).subscribe(() => {
              this.notificationSvc.notify('Utente segnalato con successo', 'success');
            });
          }
        });
      }
    });
  }
}
