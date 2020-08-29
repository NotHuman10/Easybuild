import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly logoSrcDark: string = './assets/svg/logo-dark.svg';
  readonly logoSrcLight: string = './assets/svg/logo.svg';
  @Input() isDarkTheme: boolean;
  @Output() themeToggle: EventEmitter<boolean> = new EventEmitter();

  toggleTheme() {
    this.themeToggle.emit(!this.isDarkTheme);
  }
  
  constructor(
    private authService: AuthService,
    private router: Router) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate([environment.guestDefaultRoute]);
  }
}