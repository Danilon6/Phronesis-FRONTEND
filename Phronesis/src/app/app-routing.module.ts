import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'feed', loadChildren: () => import('./pages/feed/feed.module').then(m => m.FeedModule) },
  { path: 'sharedModule', loadChildren: () => import('./sharedModule/post-shared-module/post-shared-module.module').then(m => m.SharedModuleModule) },
  { path: 'profile/:userId', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'reports', loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule) },
  { path: 'advert', loadChildren: () => import('./pages/advert/advert.module').then(m => m.AdvertModule) },
  { path: 'user-managment', loadChildren: () => import('./pages/user-managment/user-managment.module').then(m => m.RolesModule) },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
