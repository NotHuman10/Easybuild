import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Config } from '@app/app.config';
import { StateService } from '@app/core/services/state.service';
import { JobCategoryService } from '@core/services/job-category.service';
import { NotificationService } from '@core/services/notification.service';
import { AdvertExtended } from '@shared/models/advert-extended';
import { AdvertPageRequest } from '@shared/models/advert-page-request';
import { AdvertSortingOption, SortOrder } from '@shared/models/enums';
import { JobCategory } from '@shared/models/job-category';
import { Page } from '@shared/models/page';
import { Observable } from 'rxjs';
import { AdvertService } from '../../../core/services/advert.service';

interface AdvertSearchPageState {
  pageIndex: number;
  pageSize: number;
  tileMode: boolean;
  formstate: any
}

@Component({
  selector: 'app-advert-search',
  templateUrl: './advert-search.component.html',
  styleUrls: ['./advert-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvertSearchComponent implements OnInit, OnDestroy {
  private readonly PAGESTATE_KEY: string = 'advsch_pagestate';
  public page: Page<AdvertExtended> = new Page<AdvertExtended>();
  public jobCategories$: Observable<JobCategory[]>;
  public tileMode: boolean = false;

  public readonly sortingOptions = [
    {
      name: "Date added",
      icon: "date_range",
      value: AdvertSortingOption.DateAdded
    },
    {
      name: "Creator rating",
      icon: "star",
      value: AdvertSortingOption.AccountRating
    },
    {
      name: "Creator contracts",
      icon: "request_quote",
      value: AdvertSortingOption.CompletedContracts
    },
  ];

  public searchForm: FormGroup = new FormGroup({
    'jobCategories': new FormControl([]),
    'sortingOptions': new FormControl(this.sortingOptions[0].value),
    'sortAscending': new FormControl(false),
    'searchKeywords': new FormControl(),
    'searchInDescription': new FormControl(false)
  });

  constructor(
    private jobCategoryService: JobCategoryService,
    private advertService: AdvertService,
    private notificationService: NotificationService,
    private state: StateService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.jobCategories$ = this.jobCategoryService.getCategories();
    if(this.restorePageState()) {
      this.search();
    }
  }

  toggleSortOrder(): void {
    let ctrl = this.searchForm.get('sortAscending');
    ctrl.setValue(!ctrl.value);
  }

  search(event?: any): void {
    let request = this.prepareSearchRequest(event);
    this.advertService.search(request)
      .subscribe({ next: res => this.onSearchComplete(res) });
  }

  private prepareSearchRequest(event?: any): AdvertPageRequest {
    let ctrl = this.searchForm.controls;
    return {
      pageIndex: event?.pageIndex ?? 0,
      pageSize: event?.pageSize ?? Config.GlobalDefault.PAGE_SIZE,
      advertSortingOption: ctrl['sortingOptions'].value,
      sortOrder: ctrl['sortAscending'].value ? SortOrder.ASC : SortOrder.DESC,
      searchKeywords: ctrl['searchKeywords'].value,
      searchInDescription: ctrl['searchInDescription'].value,
      jobCategoriesId: ctrl['jobCategories'].value?.map((c: JobCategory) => c.id) || []
    };
  }

  private onSearchComplete(page: Page<AdvertExtended>): void {
    this.page = page;
    this.cdr.detectChanges();
    if (!page.items?.length) {
      this.notificationService.showInfo("Couldn't find any results matching criteria");
    }
  }

  private savePageState() {
    let pageState: AdvertSearchPageState = {
      pageSize: this.page.pageSize,
      pageIndex: this.page.pageIndex,
      tileMode: this.tileMode,
      formstate: this.searchForm.value
    };

    this.state.set(this.PAGESTATE_KEY, pageState);
  }

  private restorePageState(): boolean {
    let pageState: AdvertSearchPageState = this.state.get(this.PAGESTATE_KEY);
    if(pageState) {
      this.page.pageSize = pageState.pageSize;
      this.page.pageIndex = pageState.pageIndex;
      this.tileMode = pageState.tileMode;
      this.searchForm.patchValue(pageState.formstate);
      return true;
    }

    return false;
  }

  ngOnDestroy(): void {
    this.savePageState();
  }
}