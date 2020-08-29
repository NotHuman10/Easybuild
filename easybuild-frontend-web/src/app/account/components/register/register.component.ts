import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { RsaEncryptionService } from '@app/cryptography/rsa-encryption.service';
import { NotificationService } from '@core/services/notification.service';
import { RegisterModel } from '@shared/models/register-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({
    'email': new FormControl('',
      Validators.email),
    'name': new FormControl(''),
    'lastName': new FormControl(''),
    'mobile': new FormControl('',
      Validators.pattern('^\\d{12,15}$')),
    'role': new FormControl(1),
    'password': new FormControl('',
      Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\\d!@#$%^&*()_+=]{8,}$')),
    'retypePassword': new FormControl('')
  },
    this.retypePasswordValidator()
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private rsa: RsaEncryptionService) { }

  onSubmit(): void {
    this.prepareRequest().subscribe({ next: req => this.register(req) });
  }

  private prepareRequest(): Observable<RegisterModel> {
    let ctrl = this.registerForm.controls;
    return this.rsa.encryptString(ctrl['password'].value)
      .pipe(map(encryptedPassword => {
        return {
          username: ctrl['email'].value,
          name: ctrl['name'].value,
          lastName: ctrl['lastName'].value,
          role: ctrl['role'].value,
          mobile: ctrl['mobile'].value,
          password: encryptedPassword
        }
      }));
  }

  private register(model: RegisterModel): void {
    this.authService.register(model)
      .subscribe({
        complete: () => {
          this.notificationService.showSuccess("Successfully registered");
          this.router.navigate(['/account/login']);
        }
      });
  }

  private retypePasswordValidator(): ValidatorFn {
    return (form: FormGroup): { [key: string]: any } | null => {
      let pass = form.controls['password'];
      let retypePass = form.controls['retypePassword'];
      if (pass.value != retypePass.value) {
        retypePass.setErrors({ 'retypeInvalid': true });
      } else {
        retypePass.setErrors(null);
      }
      return null;
    }
  }
}