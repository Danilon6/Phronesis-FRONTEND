import { Component } from '@angular/core';
import { PostService } from '../../serivces/post.service';
import { IPost } from '../../models/i-post';
import { CreatePostDialogComponent } from '../../mainComponents/dialogs/create-post-dialog/create-post-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  showComments: { [key: number]: boolean } = {};
  newComment: { content: string } = { content: '' };

  postArr:IPost[] = []

  constructor(private dialog: MatDialog,
    private postSvc:PostService) { }

  ngOnInit(): void {
    this.postSvc.post$.subscribe(postArr => {
      this.postArr = postArr
    console.log(postArr);

    })
  }

  openCreatePostDialog(): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aggiungi il nuovo post al postArr
        this.postArr.unshift(result); // Aggiungi il nuovo post all'inizio dell'array
      }
    });
  }

  toggleComments(postId: number): void {
    this.showComments[postId] = !this.showComments[postId];
  }

  toggleLike(post: any): void {
    // Logica per il like
  }

  toggleFavorite(post: any): void {
    // Logica per aggiungere ai preferiti
  }

  reportPost(post: any): void {
    // Logica per segnalare il post
  }

  addComment(post: any): void {
    if (this.newComment.content.trim()) {
      post.comments.push({
        user: { name: 'Username' }, // Placeholder per l'utente
        content: this.newComment.content
      });
      this.newComment.content = '';
    }
  }

  reportComment(comment: any): void {
    // Logica per segnalare il commento
  }
}
