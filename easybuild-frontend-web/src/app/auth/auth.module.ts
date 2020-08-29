import { NgModule } from '@angular/core';
import { CryptographyModule } from '@app/cryptography/cryptography.module';
import { AuthService } from './auth.service';
import { AnonymousGuard } from './guards/anonymous.guard';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  providers: [
    AuthService,
    AuthGuard,
    AnonymousGuard
  ],
  exports: [
    CryptographyModule
  ]
})
export class AuthModule { }