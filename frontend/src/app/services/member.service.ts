import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RestServiceInterface } from './rest.service.interface';
import Model from '../models/model';
import { Http } from '@angular/http';
import { LoginService } from './login.service';
import Group from '../models/group.model';
import Member from '../models/member.model';

@Injectable()
export class MemberService implements RestServiceInterface<Member> {

  private route: string;

  private currentGroup: Group;

  constructor(private http: Http,
              private loginService: LoginService) {
    this.route = environment.apiEndpoint + '/group/';
  }

  setCurrentGroup(group: Group) {
    this.currentGroup = group;
    this.route = environment.apiEndpoint + '/group/' + group._id + '/member';
  }

  single(_id: number): Promise<Model> {
    return this.http.get(this.route + '/' + _id, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new Member(response);
      })
      .toPromise();
  }

  public get(): Promise<Member[]> {
    return this.http.get(this.route, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        const jsonResponse = response.json();

        // Map the rows to the models.
        return jsonResponse.map((row) => {
          return new Member(row);
        });
      })
      .toPromise();
  }

  public post(note: Member): Promise<Member> {
    return this.http.post(this.route, note, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return note;
      })
      .toPromise();
  }

  public remove(note: Member): Promise<Object> {
    return this.http.delete(this.route + '/' + note._id, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return response.json();
      })
      .toPromise();
  }

  public patch(note: Member): Promise<Member> {
    return this.http.patch(this.route + '/' + note._id, note, this.loginService.buildAuthorizationHeaders())
      .map((response) => {
        return new Member(response);
      })
      .toPromise();
  }

}
