import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class SpinnerService {
  private indicatorSubject = new BehaviorSubject<[string, boolean]>([null, false]);
  isLoading$ = this.indicatorSubject.asObservable().pipe(distinctUntilChanged());

  start(token: string): void {
    this.indicatorSubject.next([token, true]);
  }

  stop(token: string): void {
    this.indicatorSubject.next([token, false]);
  }
}