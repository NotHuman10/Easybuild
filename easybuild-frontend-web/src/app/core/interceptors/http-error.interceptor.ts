import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          this.notificationService.showError('Client side error occured');
        }
        else {
          this.handleHttpError(error);
        }

        return throwError(error);
      })
    );
  }

  private handleBadRequest(response: HttpErrorResponse): void {
    let errors = response.error?.errors || response.error;
    let messages: string[] = [];
    Object.keys(errors).forEach((key) => {
      let msg = (<string[]>errors[key])
        .map(e => `${key}: ${e}`)
        .join('<br/>');
      messages.push(msg);
    });
    let joinedMsg = messages.join('<br/><br/>');
    this.notificationService.showError(response.error.title, joinedMsg);
  }

  private handleUnauthorized(response: HttpErrorResponse): void {
    if (this.authService.isAuthorized()) {
      this.authService.logout();
      this.router.navigate([environment.guestDefaultRoute]);
    } else {
      this.notificationService.showWarning(response.error || response.message);
    }
  }

  private handleOther(response: HttpErrorResponse): void {
    //other 4XX errors
    let commonCode = (response.status - response.status % 100) / 100;
    if (commonCode == 4) {
      this.notificationService.showError(response.error?.title || response.error || response.message);
    }
    //other 5XX errors
    else if (commonCode == 5) {
      this.notificationService.showError(
        response.error?.title || 'Server error occured :(',
        response.error?.detail);
    }
    //other
    else {
      this.notificationService.showError(
        "Unknown error occured",
        "See browser console for details (press F12)");
    }
  }

  private handleHttpError(response: HttpErrorResponse): void {
    switch (response.status) {
      case 400:
        this.handleBadRequest(response);
        break;
      case 401:
        this.handleUnauthorized(response);
        break;
      default:
        this.handleOther(response);
        break;
    }
  }
}