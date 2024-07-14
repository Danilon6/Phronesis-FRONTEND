import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from './auth/guest.guard';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';

const routes: Routes = [{
  path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
title: "Home" },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivateChild:[GuestGuard]
  },
  { path: 'feed', loadChildren: () => import('./pages/feed/feed.module').then(m => m.FeedModule), canActivate: [AuthGuard],
    title: "Feed"
  },
  { path: 'profile/:userId', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard],
    title: "Profilo"
  },
  { path: 'reports', loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule), canActivate: [AdminGuard],
    title:"Segnalazioni"
   },
  { path: 'advert', loadChildren: () => import('./pages/advert/advert.module').then(m => m.AdvertModule),canActivate: [AdminGuard],
    title:"Ads"
    },
  { path: 'user-managment', loadChildren: () => import('./pages/user-managment/user-managment.module').then(m => m.RolesModule), canActivate: [AdminGuard],
    title:"Gestione Utenti"
    },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
