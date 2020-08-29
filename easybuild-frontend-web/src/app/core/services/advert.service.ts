import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Config } from '@app/app.config';
import { PageRequest } from '@app/shared/models/page-request';
import { environment } from '@env/environment';
import { Advert } from '@shared/models/advert';
import { AdvertExtended } from '@shared/models/advert-extended';
import { AdvertPageRequest } from '@shared/models/advert-page-request';
import { Page } from '@shared/models/page';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AdvertService {
  constructor(private http: HttpClient) { }

  create(advert: Advert) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this.http.post(environment.apiUrl + 'advert', advert, { headers: headers });
  }

  search(requestModel: AdvertPageRequest): Observable<Page<AdvertExtended>> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this.http.post(environment.apiUrl + 'advert/search', requestModel, { headers: headers })
      .pipe(map((data: Page<AdvertExtended>) => data));
  }

  getAdvert(id: number): Observable<AdvertExtended> {
    return this.http.get(environment.apiUrl + `advert/${id}`)
      .pipe(map((data: AdvertExtended) => data));
  }

  deleteAdvert(id: number): Observable<any> {
    return this.http.delete(environment.apiUrl + `advert/${id}`);
  }

  getFavorites(requestModel: PageRequest): Observable<Page<AdvertExtended>> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this.http.post(environment.apiUrl + 'advert/favorite/search', requestModel, { headers: headers })
      .pipe(map((data: Page<AdvertExtended>) => data));
  }

  addFavorite(advertId: number): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set(Config.Settings.BYPASS_LOADING_INDICATOR_HTTPHEADER, 'true');
    return this.http.post(environment.apiUrl + 'advert/favorite', advertId, { headers: headers })
  }

  deleteFavorite(advertId: number): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set(Config.Settings.BYPASS_LOADING_INDICATOR_HTTPHEADER, 'true');
    return this.http.delete(environment.apiUrl + 'advert/favorite/' + advertId, { headers: headers });
  }
}