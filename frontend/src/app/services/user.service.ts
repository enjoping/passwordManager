import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {environment} from '../../environments/environment';
import User from '../models/user.model';
import {RestServiceInterface} from './rest.service.interface';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {LoginService} from './login.service';

@Injectable()
export default class UserService implements RestServiceInterface<User> {

  private route: string;

  constructor(private http: Http,
              private loginService: LoginService) {
    this.route = environment.apiEndpoint + '/user';
  }

  single(_id: number): Promise<User> {
    return this.http.get(this.route + '/' + _id, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new User().jsonFill(response);
      })
      .toPromise();
  }

  public get(): Promise<User[]> {
    return this.http.get(this.route, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        const jsonResponse = response.json();

        // Map the rows to the models.
        return jsonResponse.map((row) => {
          return new User().jsonFill(row);
        });
      })
      .toPromise();
  }

  public post(user: User): Promise<User> {
    return this.http.post(this.route, user, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new User().jsonFill(response);
      })
      .toPromise();
  }

  public remove(user: User): Promise<Object> {
    return this.http.delete(this.route + '/' + user._id, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return response.json();
      })
      .toPromise();
  }

  public patch(user: User): Promise<User> {
    return this.http.patch(this.route + '/' + user._id, user, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new User().jsonFill(response);
      })
      .toPromise();
  }
}
