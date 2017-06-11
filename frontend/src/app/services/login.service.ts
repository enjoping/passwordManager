import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/toPromise';
import EventService from './event/event.service';

@Injectable()
export class LoginService {

  accessToken: string;

  private route: string;

  constructor(private http: Http,
              private eventService: EventService) {
    this.route = environment.apiEndpoint + '/login';
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
              this.accessToken = result.toString();
              resolve();
            }
            else if (result.status === 401) {
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
}
