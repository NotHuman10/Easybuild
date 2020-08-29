import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AdvertRoutingModule } from './advert-routing.module';
import { AdvertCreateComponent } from './components/advert-create/advert-create.component';
import { AdvertFavoritesComponent } from './components/advert-favorites/advert-favorites.component';
import { AdvertSearchComponent } from './components/advert-search/advert-search.component';
import { AdvertViewComponent } from './components/advert-view/advert-view.component';
import { AdvertComponent } from './components/advert/advert.component';
import { FavoriteIndicatorComponent } from './components/favorite-indicator/favorite-indicator.component';
import { JobCategoryTreeComponent } from './components/job-category-tree/job-category-tree.component';

@NgModule({
  declarations: [
    AdvertSearchComponent,
    JobCategoryTreeComponent,
    AdvertComponent,
    AdvertCreateComponent,
    AdvertViewComponent,
    AdvertFavoritesComponent,
    FavoriteIndicatorComponent
  ],
  imports: [
    SharedModule,
    AdvertRoutingModule
  ]
})
export class AdvertModule { }