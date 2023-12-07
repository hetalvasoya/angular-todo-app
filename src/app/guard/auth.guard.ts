import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const oauthServices: AuthService = inject(AuthService);
    console.log(oauthServices.hasAccess());
    if(oauthServices.hasAccess()) {
      return true;
    }  
    oauthServices.logOut();
    return false;
};
