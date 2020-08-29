import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { JobCategory } from '@shared/models/job-category';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class JobCategoryService {
  constructor(private http: HttpClient) { }

  getCategories(): Observable<JobCategory[]> {
    return this.http.get(environment.apiUrl + 'job-categories')
      .pipe(map(response => response as JobCategory[]));
  }
}