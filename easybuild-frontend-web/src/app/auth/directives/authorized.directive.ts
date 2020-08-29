import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserRole } from '@shared/models/enums';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Directive({
  selector: '[forAuthorized]',
})
export class AuthorizedDirective implements OnInit, OnDestroy {
  @Input('forAuthorized') roles: string | string[];

  private hasView: boolean;
  private authChanging: Subscription;

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
    this.hasView = false;
  }

  private manageView(): void {
    var currentRole: string;
    if(this.authService.identity) {
      currentRole = UserRole[this.authService.identity.roleId];
    }

    if (this.authService.isAuthorized()
      && (!this.roles || this.roles == currentRole || this.roles.includes(currentRole))) {
      if (!this.hasView) {
        let view = this.viewContainer.createEmbeddedView(this.templateRef);
        view.detectChanges();
        this.hasView = true;
      }
    } else if (this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  ngOnInit(): void {
    this.manageView();
    this.authChanging = this.authService.onAuthChanged$
      .subscribe(() => this.manageView());
  }

  ngOnDestroy(): void {
    this.authChanging.unsubscribe();
  }
}