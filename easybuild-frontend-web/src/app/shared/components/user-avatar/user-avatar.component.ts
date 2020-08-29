import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImageService } from '@app/core/services/image.service';
import { UserIdentity } from '../../models/user-identity';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAvatarComponent implements OnInit, OnDestroy {
  @Input() user: UserIdentity;
  @Input() size: number = 40;
  avatarUrl: string;
  defaultAvatarUrl: string;
  defaultAvatarSafeUrl: SafeResourceUrl;

  constructor(private imageService: ImageService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (this.user?.avatarId) {
      this.avatarUrl = this.imageService.getUrlFromId(this.user.avatarId);
    } else if (this.user) {
      this.defaultAvatarUrl = this.imageService.generateDefaultAvatarUrl(this.user);
      this.defaultAvatarSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.defaultAvatarUrl);
    }
  }

  ngOnDestroy(): void {
    URL.revokeObjectURL(this.defaultAvatarUrl);
  }
}