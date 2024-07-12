import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from './auth/guest.guard';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';

const routes: Routes = [{
  path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivateChild:[GuestGuard] },
  { path: 'feed', loadChildren: () => import('./pages/feed/feed.module').then(m => m.FeedModule), canActivate: [AuthGuard] },
  { path: 'profile/:userId', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
  { path: 'reports', loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule), canActivate: [AdminGuard] },
  { path: 'advert', loadChildren: () => import('./pages/advert/advert.module').then(m => m.AdvertModule),canActivate: [AdminGuard]  },
  { path: 'user-managment', loadChildren: () => import('./pages/user-managment/user-managment.module').then(m => m.RolesModule), canActivate: [AdminGuard]  },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
