import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RsaEncryptionService } from './rsa-encryption.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    RsaEncryptionService
  ]
})
export class CryptographyModule { }