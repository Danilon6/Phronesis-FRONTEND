import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'feed', loadChildren: () => import('./pages/feed/feed.module').then(m => m.FeedModule) },
  { path: 'sharedModule', loadChildren: () => import('./shared-module/shared-module.module').then(m => m.SharedModuleModule) },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
