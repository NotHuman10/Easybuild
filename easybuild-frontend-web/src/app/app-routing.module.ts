import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousGuard } from '@app/auth/guards/anonymous.guard';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { environment } from '@env/environment';
import { HomePageComponent } from '@shared/components/home-page/home-page.component';
import { StartPageComponent } from '@shared/components/start-page/start-page.component';

const routes: Routes = [
  {
    path: "account",
    loadChildren: () => import('@app/account/account.module').then(m => m.AccountModule)
  },
  {
    path: "advert",
    loadChildren: () => import('@app/advert/advert.module').then(m => m.AdvertModule),
    canActivate: [AuthGuard],
    data: { altRoute: environment.guestDefaultRoute }
  },
  {
    path: "",
    component: StartPageComponent,
    canActivate: [AnonymousGuard],
    pathMatch: "full",
    data: { altRoute: environment.homeRoute }
  },
  {
    path: "home",
    component: HomePageComponent,
    canActivate: [AuthGuard],
    data: { altRoute: environment.guestDefaultRoute }
  },
  {
    path: "chat",
    loadChildren: () => import('@app/chat/chat.module').then(m => m.ChatModule),
    canActivate: [AuthGuard],
    data: { altRoute: environment.guestDefaultRoute }
  },
  {
    path: "contract",
    loadChildren: () => import('@app/contract/contract.module').then(m => m.ContractModule),
    canActivate: [AuthGuard],
    data: { altRoute: environment.guestDefaultRoute }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }