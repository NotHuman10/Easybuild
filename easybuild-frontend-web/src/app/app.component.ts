import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Config } from './app.config';
import { AuthService } from './auth/auth.service';
import { IotService } from './core/services/iot.service';
import { PermanentStorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public isDarkTheme: boolean;

  setTheme(isDark: boolean) {
    this.isDarkTheme = isDark;
    this.storage.set(Config.Settings.ISDARKTHEME, this.isDarkTheme);
    
    if(this.isDarkTheme) {
      this.renderer.removeClass(this.document.body, Config.Settings.LIGHT_THEME_CLASS);
      this.renderer.addClass(this.document.body, Config.Settings.DARK_THEME_CLASS);
    } else {
      this.renderer.removeClass(this.document.body, Config.Settings.DARK_THEME_CLASS);
      this.renderer.addClass(this.document.body, Config.Settings.LIGHT_THEME_CLASS);
    }
  }

  constructor(
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2,
    private storage: PermanentStorageService,
    private authService: AuthService,
    private router: Router,
    private iot: IotService) { }

  ngOnInit(): void {
    this.isDarkTheme = this.storage.get(Config.Settings.ISDARKTHEME) ?? this.isDarkThemePriority();
    this.setTheme(this.isDarkTheme);
    
    if (!this.authService.isAuthorized()) {
      this.router.navigate([environment.guestDefaultRoute]);
    }

    this.authService.onAuthChanged$.subscribe(a => {
      if(this.authService.isAuthorized) {
        this.iot.startConnection();
      } else {
        this.iot.stopConnection();
      }
    });
  }

  private isDarkThemePriority() {
    let hours = new Date(Date.now()).getHours();
    return hours < 7 || hours > 18;
  }

  ngOnDestroy(): void {
    this.iot.stopConnection();
  }
}