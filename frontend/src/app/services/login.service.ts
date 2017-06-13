import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/toPromise';
import EventService from './event/event.service';
import {Router} from '@angular/router';
import {UserRepositoryService} from './repositories/user-repository.service';
import User from '../models/user.model';

@Injectable()
export class LoginService {

  accessToken: string;

  currentUser: User;

  private route: string;

  constructor(private http: Http,
              private router: Router,
              private eventService: EventService) {
    this.route = environment.apiEndpoint + '/login';
  }

  /**
   * Can be called by any service if we receive an 401 response, which means the
   * access token is not valid anymore.
   */
  accessTokenNotValid() {
    this.accessToken = null;
    this.eventService.inform(this, 'authorization-status-change', { authorized: false });

    this.router.navigate([ '/' ]);
  }

  setCurrentUser(currentUser: User) {
    this.currentUser = currentUser;

    this.eventService.inform(this, 'authorization-status-change', { authorized: true, user: this.currentUser });
  }

  login(username: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        this.http.post(this.route, {
          username: username,
          password: password
        })
          .toPromise()
          .then((result) => {
            this.eventService.log(result);

            if (result.ok) {
              // The login was successful.
              this.accessToken = result.text();

              resolve();
            } else if (result.status === 401) {
              // The password/username is wrong.
              reject(result.status);
            }
          })
          .catch((error) => {
            this.eventService.log(error);
            reject(0);
          });
      }
    );
  }

  buildAuthorizationHeaders(): RequestOptions {
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.accessToken);
    headers.append('Content-Type', 'application/json');

    return new RequestOptions({ headers: headers });
  }
}
