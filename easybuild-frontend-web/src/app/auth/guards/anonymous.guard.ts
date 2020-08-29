import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from '../auth.service';

@Injectable()
export class AnonymousGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.authenticationService.isAuthorized()) {
            return true;
        } else if (route.data['altRoute']) {
            this.router.navigate([route.data['altRoute']]);
        }

        return false;
    }
}