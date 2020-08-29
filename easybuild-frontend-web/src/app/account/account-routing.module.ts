import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@app/account/components/login/login.component';
import { RegisterComponent } from '@app/account/components/register/register.component';
import { AnonymousGuard } from '@app/auth/guards/anonymous.guard';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { environment } from '@env/environment';
import { ProfileManagementComponent } from './components/profile-management/profile-management.component';

const accountRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AnonymousGuard],
    data: { altRoute: environment.homeRoute }
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AnonymousGuard],
    data: { altRoute: environment.homeRoute }
  },
  {
    path: 'profile-management',
    component: ProfileManagementComponent,
    canActivate: [AuthGuard],
    data: { altRoute: environment.guestDefaultRoute }
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(accountRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }