import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SpinnerService } from '@app/core/services/spinner.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  @Input() token: string;
  @Input() atop: boolean;
  isActive$: Observable<boolean>;

  constructor(private spinnerService: SpinnerService) {
    this.isActive$ = this.spinnerService.isLoading$
      .pipe(map(a => a[0] == this.token && a[1]));
  }
}