import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnonymousOnlyDirective } from '@app/auth/directives/anonymous-only.directive';
import { AuthorizedDirective } from '@app/auth/directives/authorized.directive';
import { MaterialModule } from '@app/material/material.module';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { HeaderComponent } from './components/header/header.component';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ProposalComponent } from './components/proposal/proposal.component';
import { RatingComponent } from './components/rating/rating.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    AuthorizedDirective,
    AnonymousOnlyDirective,
    SnackbarComponent,
    RatingComponent,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    ImagePickerComponent,
    SafeUrlPipe,
    UserAvatarComponent,
    ProposalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HeaderComponent,
    SidenavComponent,
    RatingComponent,
    AuthorizedDirective,
    AnonymousOnlyDirective,
    FlexLayoutModule,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    ImagePickerComponent,
    SafeUrlPipe,
    UserAvatarComponent,
    ProposalComponent
  ]
})
export class SharedModule { }