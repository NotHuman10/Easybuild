import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarParams } from '@shared/components/snackbar/snackbar-params';
import { SnackbarComponent } from '@shared/components/snackbar/snackbar.component';

@Injectable()
export class NotificationService {
  private static readonly DEFAULT_DURATION: number = 5000;
  private static readonly DEFAULT_POSITION_X: any = "end";
  private static readonly DEFAULT_POSITION_Y: any = "bottom";

  constructor(private _snackBar: MatSnackBar) { }

  showError(title: string, message?: string): void {
    let params: SnackbarParams = {
      title: title,
      message: message,
      icon: "error",
      dismissable: true
    }

    this._snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['bg-warn'],
      verticalPosition: NotificationService.DEFAULT_POSITION_Y,
      horizontalPosition: NotificationService.DEFAULT_POSITION_X,
      data: params
    });
  }

  showSuccess(title: string, message?: string): void {
    let params: SnackbarParams = {
      title: title,
      message: message,
      icon: "check_circle",
      dismissable: false
    }

    this._snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['bg-success'],
      verticalPosition: NotificationService.DEFAULT_POSITION_Y,
      horizontalPosition: NotificationService.DEFAULT_POSITION_X,
      duration: NotificationService.DEFAULT_DURATION,
      data: params
    });
  }

  showWarning(title: string, message?: string): void {
    let params: SnackbarParams = {
      title: title,
      message: message,
      icon: "warning",
      dismissable: false
    }

    this._snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['bg-alert'],
      verticalPosition: NotificationService.DEFAULT_POSITION_Y,
      horizontalPosition: NotificationService.DEFAULT_POSITION_X,
      duration: NotificationService.DEFAULT_DURATION,
      data: params
    });
  }

  showInfo(title: string, message?: string): void {
    let params: SnackbarParams = {
      title: title,
      message: message,
      icon: "info",
      dismissable: true
    }

    this._snackBar.openFromComponent(SnackbarComponent, {
      verticalPosition: NotificationService.DEFAULT_POSITION_Y,
      horizontalPosition: NotificationService.DEFAULT_POSITION_X,
      panelClass: ['bg-info'],
      data: params
    });
  }
}