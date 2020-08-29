import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Directive({
  selector: '[forAnonymousOnly]'
})
export class AnonymousOnlyDirective implements OnInit, OnDestroy {
  private hasView: boolean;
  private authChanging: Subscription;
  
  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
    this.hasView = false;
  }

  private manageView(): void {
    if (!this.authService.isAuthorized()) {
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