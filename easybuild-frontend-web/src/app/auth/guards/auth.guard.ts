import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserRole } from '@shared/models/enums';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let allowedRoles = route.data['roles'] as UserRole[];
        if (this.authenticationService.isAuthorized()
            && (!allowedRoles || allowedRoles.includes(this.authenticationService.identity.roleId))) {
            return true;
        } else if (route.data['altRoute']) {
            this.router.navigate([route.data['altRoute']]);
        }

        return false;
    }
}