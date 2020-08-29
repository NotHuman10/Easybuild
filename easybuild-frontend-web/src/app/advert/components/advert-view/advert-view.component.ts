import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { DialogService } from '@app/core/services/dialog.service';
import { ImageService } from '@app/core/services/image.service';
import { NotificationService } from '@app/core/services/notification.service';
import { AdvertExtended } from '@app/shared/models/advert-extended';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { concatMap, filter, tap } from 'rxjs/operators';
import { AdvertService } from '../../../core/services/advert.service';

@Component({
  selector: 'app-advert-view',
  templateUrl: './advert-view.component.html',
  styleUrls: ['./advert-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvertViewComponent implements OnInit {
  advert$: Observable<AdvertExtended>;
  advertImageUrl: string;
  isMineAdvert: boolean;

  constructor(
    private advertService: AdvertService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private imageService: ImageService,
    private dialog: DialogService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.advert$ = this.advertService.getAdvert(Number(id))
    .pipe(tap(a => {
        this.advertImageUrl = this.imageService.getUrlFromId(a.baseAdvert.imageId);
        this.isMineAdvert = a.baseAdvert.user.id == this.authService.identity.id;
    }));
  }

  delete(id: number): void {
    this.dialog.yesNo("Are you sure? Your advert will be deleted peranently").pipe(
      filter(r => r),
      concatMap(() => this.advertService.deleteAdvert(id))
    ).subscribe(() => {
      this.notificationService.showSuccess("Operation completed");
      this.router.navigate([environment.homeRoute]);
    });
  }
}