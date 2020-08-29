import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '@app/app.config';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private spinnerService: SpinnerService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.headers.has(Config.Settings.BYPASS_LOADING_INDICATOR_HTTPHEADER)) {
      request.headers.delete(Config.Settings.BYPASS_LOADING_INDICATOR_HTTPHEADER);
      return next.handle(request);
    }

    this.activeRequests++;
    this.spinnerService.start('main-spinner');

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests == 0) {
          this.spinnerService.stop('main-spinner');
        }
      })
    );
  }
}