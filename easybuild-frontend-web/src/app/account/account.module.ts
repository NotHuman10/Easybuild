import { NgModule } from '@angular/core';
import { LoginComponent } from '@app/account/components/login/login.component';
import { RegisterComponent } from '@app/account/components/register/register.component';
import { SharedModule } from '@shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { ProfileManagementComponent } from './components/profile-management/profile-management.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ProfileManagementComponent
  ],
  imports: [
    SharedModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }