import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {RestServiceInterface} from './rest.service.interface';
import Model from '../models/model';
import {Http} from '@angular/http';
import SecurityNote from '../models/security-note.model';
import {LoginService} from './login.service';
import Group from '../models/group.model';

@Injectable()
export class SecurityNoteService implements RestServiceInterface<SecurityNote> {

  private route: string;

  private currentGroup: Group;

  // TODO: edit service

  constructor(private http: Http,
              private loginService: LoginService) {
    this.route = environment.apiEndpoint + '/group/';
  }

  setCurrentGroup(group: Group) {
    this.currentGroup = group;
    this.route = environment.apiEndpoint + '/group/' + group._id + '/security-note';
  }

  single(_id: number): Promise<Model> {
    return this.http.get(this.route + '/' + _id, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new SecurityNote().jsonFill(response);
      })
      .toPromise();
  }

  public get(): Promise<SecurityNote[]> {
    console.log(this.route);
    return this.http.get(this.route, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        const jsonResponse = response.json();

        // Map the rows to the models.
        return jsonResponse.map((row) => {
          return new SecurityNote().jsonFill(row);
        });
      })
      .toPromise();
  }

  public post(note: SecurityNote): Promise<SecurityNote> {
    return this.http.post(this.route, note, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new SecurityNote().jsonFill(response);
      })
      .toPromise();
  }

  public remove(note: SecurityNote): Promise<Object> {
    return this.http.delete(this.route + '/' + note._id, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return response.json();
      })
      .toPromise();
  }

  public patch(note: SecurityNote): Promise<SecurityNote> {
    return this.http.patch(this.route + '/' + note._id, note, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new SecurityNote().jsonFill(response);
      })
      .toPromise();
  }

}
