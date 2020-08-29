import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvertCreateComponent } from './components/advert-create/advert-create.component';
import { AdvertFavoritesComponent } from './components/advert-favorites/advert-favorites.component';
import { AdvertSearchComponent } from './components/advert-search/advert-search.component';
import { AdvertViewComponent } from './components/advert-view/advert-view.component';

const advertRoutes: Routes = [
  {
    path: 'search',
    component: AdvertSearchComponent
  },
  {
    path: 'create',
    component: AdvertCreateComponent
  },
  {
    path: 'favorites',
    component: AdvertFavoritesComponent
  },
  {
    path: ':id',
    component: AdvertViewComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(advertRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdvertRoutingModule { }