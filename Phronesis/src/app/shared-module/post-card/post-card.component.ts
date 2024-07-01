import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../auth/auth.service';
import { CommentService } from '../../services/comment.service';
import { LikeService } from '../../services/like.service';
import { FavoriteService } from '../../services/favorite.service';
import { IFavorite } from '../../models/i-favorite';
import { IPost } from '../../models/i-post';
import { EditPostDialogComponent } from '../../mainComponents/dialogs/edit-post-dialog/edit-post-dialog.component';
import { EditCommentDialogComponent } from '../../mainComponents/dialogs/edit-comment-dialog/edit-comment-dialog.component';
import { IComment } from '../../models/i-comment';
import { ICommentRequest } from '../../models/i-comment-request';
import { ILike } from '../../models/i-like';
import { IUserPostInteractionRequest } from '../../models/i-user-post-interaction-request';
import { LikeListDialogComponent } from '../../mainComponents/dialogs/like-list-dialog/like-list-dialog.component';

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
  postArr:IPost[] = []
  favoriteArr: IFavorite[] = [];

  constructor(private dialog: MatDialog,
    private postSvc:PostService,
  private authSvc:AuthService,
  private commentSvc:CommentService,
private likeSvc:LikeService,
private favoriteSvc:FavoriteService) {
}

  ngOnInit(): void {
    this.postSvc.post$.subscribe(postArr => {
      this.postArr = postArr
  });
  if (this.currentUserId) {
    this.favoriteSvc.getAllByUserId(this.currentUserId).subscribe(favorites => {
      this.favoriteArr = favorites;
      });
    }
  }



  //ELIMINAZIONE DEL POST
  deletePost(postId:number) {
    this.postSvc.delete(postId).subscribe()
  }

  //GESTIONE DEI DIALOGS

  openEditPostDialog(post: IPost): void {
    const dialogRef = this.dialog.open(EditPostDialogComponent, {
      width: '600px',
      data: { post }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const editedPost:Partial<IPost> = {title: result.title, content: result.content };
        this.postSvc.update(result.id, editedPost).subscribe();
      }
    });
  }


  openEditCommentDialog(comment: IComment): void {
    const dialogRef = this.dialog.open(EditCommentDialogComponent, {
      width: '250px',
      data: { comment }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const editedComment = { ...comment, content: result.content };
        this.commentSvc.update(editedComment).subscribe();
      }
    });
  }

  // GESTIONE DEI COMMENTI
  toggleComments(post: IPost): void {
    const postId = post.id;
    if (!this.showComments[postId]) {
      // Se i commenti non sono visibili, impostali su visibili e carica i commenti
      this.showComments[postId] = true;
      this.commentSvc.getAllByPostId(postId).subscribe(comments => {
        post.comments = comments;
      });
    } else {
      // Se i commenti sono già visibili, nascondili
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
      console.log(post.comments);
      post.comments.push(comment);
      this.newComment.content = '';
    });
  }

  deleteComment(commentId: number, post: IPost) {
    this.commentSvc.delete(commentId).subscribe(() => {
      post.comments = post.comments.filter(comment => comment.id !== commentId);
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
        console.log(like);
        if (!post.likes) {
          post.likes = [];
        }
        console.log(post.likes);
        post.likes. push(like as ILike);


      });
    }
  }

  viewLikes(post: IPost): void {
    this.likeSvc.getAllLikesByPostId(post.id).subscribe(likes => {
      const dialogRef = this.dialog.open(LikeListDialogComponent, {
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
      // Rimuovi dai preferiti
      const favorite = this.favoriteArr.find(fav => fav.post.id === postId && fav.user.id === userId);
      if (favorite) {
        this.favoriteSvc.removeFromFavorite(favorite.id).subscribe(() => {
          this.favoriteArr = this.favoriteArr.filter(fav => fav.id !== favorite.id);
        });
      }
    } else {
      // Aggiungi ai preferiti
      const newFavorite: IUserPostInteractionRequest = {
        postId: postId,
        userId: userId
      };
      this.favoriteSvc.addToFavorite(newFavorite).subscribe(favorite => {
        this.favoriteArr.push(favorite as IFavorite);
      });
    }
  }

  reportPost(post: any): void {
    // Logica per segnalare il post
  }

  reportComment(comment: any): void {
    // Logica per segnalare il commento
  }
}
