import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { UserIdentity } from '@shared/models/user-identity';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  user: UserIdentity;

  constructor(private authService: AuthService) {
    this.user = this.authService.identity;
  }
}