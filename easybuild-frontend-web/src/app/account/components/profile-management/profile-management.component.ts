import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/auth.service';
import { ImageService } from '@app/core/services/image.service';
import { NotificationService } from '@app/core/services/notification.service';
import { UserIdentity } from '@app/shared/models/user-identity';
import { ProfileManagementModel } from "@shared/models/profile-management";
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileManagementComponent implements OnInit, OnDestroy {
  defaultAvatarUrl: string;
  user: UserIdentity;
  profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private imgService: ImageService,
    private notificationServce: NotificationService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.setupPage();
    
    this.profileForm = new FormGroup({
      'avatar': new FormControl(this.imgService.getUrlFromId(this.user.avatarId)),
      'bio': new FormControl(this.user.bio),
      'name': new FormControl(this.user.name),
      'lastName': new FormControl(this.user.lastName),
      'mobile': new FormControl(this.user.mobile, Validators.pattern('^\\d{12,15}$')),
    });
  }

  clearBioInput(): void {
    this.profileForm.get('bio').setValue(null);
    this.profileForm.markAsDirty();
  }

  onSubmit(): void {
    this.sendImageRequest()
      .pipe(concatMap(imgId => {
        return this.authService.patchProfile(this.prepareRequest(imgId));
      }))
      .subscribe(() => {
        this.onProfilePatched();
      });
  }

  private setupPage(): void {
    if (this.defaultAvatarUrl) {
      URL.revokeObjectURL(this.defaultAvatarUrl);
    }
    this.user = JSON.parse(JSON.stringify(this.authService.identity));
    this.defaultAvatarUrl = this.imgService.generateDefaultAvatarUrl(this.user);
  }

  private sendImageRequest(): Observable<string> {
    let oldImageId = this.user.avatarId;
    let newImage = this.profileForm.get('avatar').value;
    if (!oldImageId && newImage) {
      return this.imgService.postImage(newImage);
    }
    else if (oldImageId && !newImage) {
      return this.imgService.deleteImage(oldImageId);
    }
    else if (oldImageId && newImage) {
      return this.imgService.putImage(newImage, oldImageId)
        .pipe(concatMap(() => of(oldImageId)));
    }
    else {
      return of(oldImageId);
    }
  }

  private prepareRequest(imgId: string): ProfileManagementModel {
    let ctrl = this.profileForm.controls;
    return {
      name: ctrl['name'].value,
      lastName: ctrl['lastName'].value,
      bio: ctrl['bio'].value,
      mobile: ctrl['mobile'].value,
      avatarId: imgId
    };
  }

  private onProfilePatched() {
    this.notificationServce.showSuccess("Changes successfully saved!");
    this.authService.refreshIdentity()
      .subscribe({
        complete: () => {
          this.setupPage();
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    URL.revokeObjectURL(this.defaultAvatarUrl);
  }
}