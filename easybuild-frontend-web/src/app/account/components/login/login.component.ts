import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { RsaEncryptionService } from '@app/cryptography/rsa-encryption.service';
import { environment } from '@env/environment';
import { LoginModel } from '@shared/models/login-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  hidePass: boolean = true;

  loginForm: FormGroup = new FormGroup({
    'email': new FormControl(),
    'password': new FormControl(),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private rsa: RsaEncryptionService) { }

  onSubmit(): void {
    this.prepareRequest().subscribe({ next: req => this.login(req) });
  }

  private prepareRequest(): Observable<LoginModel> {
    let ctrl = this.loginForm.controls;
    return this.rsa.encryptString(ctrl['password'].value)
      .pipe(map(encryptedPassword => {
        return {
          username: ctrl['email'].value,
          password: encryptedPassword
        }
      }));
  }

  private login(model: LoginModel): void {
    this.authService.login(model)
      .subscribe({
        complete: () =>
          this.router.navigate([environment.homeRoute])
      });
  }
}