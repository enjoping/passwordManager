import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import Invite from '../models/invite.model';
import {LoginService} from './login.service';

@Injectable()
export class RegisterService {

  private route: string;

  constructor(private http: Http,
              private loginService: LoginService) {
    this.route = environment.apiEndpoint + '/invite';
  }

  single(token: any): Promise<Invite> {
    return this.http.get(this.route + '/' + token, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new Invite().jsonFill(response);
      })
      .toPromise();
  }
}
