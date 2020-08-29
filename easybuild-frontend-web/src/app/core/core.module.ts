import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthModule } from '@app/auth/auth.module';
import { SharedModule } from '@shared/shared.module';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { AdvertService } from './services/advert.service';
import { DialogService } from './services/dialog.service';
import { ImageService } from './services/image.service';
import { IotService } from './services/iot.service';
import { JobCategoryService } from './services/job-category.service';
import { NotificationService } from './services/notification.service';
import { SpinnerService } from './services/spinner.service';
import { StateService } from './services/state.service';
import { PermanentStorageService } from './services/storage.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthModule
  ],
  exports: [
    HttpClientModule,
    AuthModule
  ],
  providers: [
    NotificationService,
    ImageService,
    JobCategoryService,
    PermanentStorageService,
    SpinnerService,
    StateService,
    DialogService,
    AdvertService,
    IotService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ]
})
export class CoreModule { }