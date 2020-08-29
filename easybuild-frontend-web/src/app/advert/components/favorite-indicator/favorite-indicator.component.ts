import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdvertService } from '@app/core/services/advert.service';
import { AuthService } from '@app/auth/auth.service';
import { DialogService } from '@app/core/services/dialog.service';
import { AdvertExtended } from '@app/shared/models/advert-extended';
import { of } from 'rxjs';
import { concatMap, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-favorite-indicator',
  templateUrl: './favorite-indicator.component.html',
  styleUrls: ['./favorite-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteIndicatorComponent implements OnInit {
  @Input() advert: AdvertExtended;
  @Output() toggled: EventEmitter<boolean> = new EventEmitter<boolean>();
  isMineAdvert: boolean;

  constructor(
    private authService: AuthService,
    private advertService: AdvertService,
    private dialog: DialogService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isMineAdvert = this.advert.baseAdvert.userId == this.authService.identity.id;
  }

  toggleFavorite(): void {  
    let allowToggle = this.advert.isFavorite
      ? this.dialog.yesNo("Are you sure you want remove this item from your favorites?")
      : of(true);

    let serverAction = this.advert.isFavorite
      ? this.advertService.deleteFavorite(this.advert.baseAdvert.id)
      : this.advertService.addFavorite(this.advert.baseAdvert.id);

    allowToggle.pipe(
      filter(res => res),
      concatMap(() => serverAction),
      tap(() => {
        this.advert.isFavorite = !this.advert.isFavorite;
        this.toggled.next(this.advert.isFavorite);
        this.cdr.detectChanges();
      })
    ).subscribe();
  }
}