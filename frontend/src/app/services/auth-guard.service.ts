import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {LoginService} from './login.service';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private loginService: LoginService) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return !!this.loginService.accessToken || !environment.production;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return !!this.loginService.accessToken || !environment.production;
  }
}
