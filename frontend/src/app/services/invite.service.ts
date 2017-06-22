import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {environment} from '../../environments/environment';
import {RestServiceInterface} from './rest.service.interface';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {LoginService} from './login.service';
import Invite from '../models/invite.model';

@Injectable()
export default class InviteService implements RestServiceInterface<Invite> {

  private route: string;

  constructor(private http: Http,
              private loginService: LoginService) {
    this.route = environment.apiEndpoint + '/invite';
  }

  single(_id: number): Promise<Invite> {
    return this.http.get(this.route + '/' + _id, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new Invite().jsonFill(response);
      })
      .toPromise();
  }

  public get(): Promise<Invite[]> {
    return this.http.get(this.route, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        const jsonResponse = response.json();

        // Map the rows to the models.
        return jsonResponse.map((row) => {
          return new Invite().jsonFill(row);
        });
      })
      .toPromise();
  }

  public post(invite: Invite): Promise<Invite> {
    return this.http.post(this.route, invite, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new Invite().jsonFill(response);
      })
      .toPromise();
  }

  public remove(invite: Invite): Promise<Object> {
    return this.http.delete(this.route + '/' + invite._id, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return response.json();
      })
      .toPromise();
  }

  public patch(invite: Invite): Promise<Invite> {
    return this.http.patch(this.route + '/' + invite._id, invite, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new Invite().jsonFill(response);
      })
      .toPromise();
  }
}
