import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AdvertService } from '@app/core/services/advert.service';
import { Config } from '@app/app.config';
import { StateService } from '@app/core/services/state.service';
import { AdvertExtended } from '@app/shared/models/advert-extended';
import { AdvertFavoritePageRequest } from '@app/shared/models/advert-favorite-page-request';
import { Page } from '@app/shared/models/page';

interface AdvertFavoritesPageState {
  pageIndex: number;
  pageSize: number;
  tileMode: boolean;
}

@Component({
  selector: 'app-advert-favorites',
  templateUrl: './advert-favorites.component.html',
  styleUrls: ['./advert-favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvertFavoritesComponent implements OnInit, OnDestroy {
  private readonly PAGESTATE_KEY: string = 'advfav_pagestate';
  public page: Page<AdvertExtended> = new Page<AdvertExtended>();
  public tileMode: boolean = false;
  public showOnlyMy: boolean;

  constructor(
    private advertService: AdvertService,
    private cdr: ChangeDetectorRef,
    private state: StateService) { }

  ngOnInit(): void {
    this.restorePageState();
    this.search();
  }

  search(event?: PageEvent) {
    this.advertService.getFavorites(this.prepareRequest(event))
      .subscribe(res => {
        this.page = res;
        this.cdr.detectChanges();
      });
  }

  toggleShowingMy(): void {
    this.showOnlyMy = !this.showOnlyMy;
    this.search();
  }

  toggleFavorite($event: boolean, item: AdvertExtended): void {
    let index = this.page.items.indexOf(item);
    if (!$event && index >= 0) {
      this.page.items.splice(index, 1);
    }
  }

  private prepareRequest(event?: PageEvent): AdvertFavoritePageRequest {
    return {
      pageIndex: event?.pageIndex ?? 0,
      pageSize: event?.pageSize ?? Config.GlobalDefault.PAGE_SIZE,
      showOnlyMy: this.showOnlyMy
    };
  }

  private savePageState() {
    let pageState: AdvertFavoritesPageState = {
      pageSize: this.page.pageSize,
      pageIndex: this.page.pageIndex,
      tileMode: this.tileMode
    };

    this.state.set(this.PAGESTATE_KEY, pageState);
  }

  private restorePageState() {
    let pageState: AdvertFavoritesPageState = this.state.get(this.PAGESTATE_KEY);
    if(pageState) {
      this.page.pageSize = pageState.pageSize;
      this.page.pageIndex = pageState.pageIndex;
      this.tileMode = pageState.tileMode
    }
  }

  ngOnDestroy(): void {
    this.savePageState();
  }
}