import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { environment } from '@env/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { NotificationService } from './notification.service';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class IotService {
  private hubConnection: HubConnection;

  constructor(
    private notifSvc: NotificationService,
    private authService: AuthService) { }

  startConnection(): void {
    if (this.hubConnection != null) {
      return;
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.apiUrl + 'iothub', { accessTokenFactory: () => this.authService.jwt })
      .withAutomaticReconnect()
      .build();

    from(this.hubConnection.start())
      .pipe(
        tap(() => {
          this.hubConnection.on('IOTDeviceCalled', (message: string) => {
            this.notifSvc.showInfo(message);
          });
        })
      )
      .subscribe();
  }

  stopConnection(): void {
    this.hubConnection?.stop();
    this.hubConnection = null;
  }
}