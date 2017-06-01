import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {environment} from "../../environments/environment";
import Group from "../models/group.model";
import {RestServiceInterface} from "./rest.service.interface";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export default class GroupService implements RestServiceInterface<Group> {

  private route: string;

  constructor(private http: Http) {
    this.route = environment.apiEndpoint + '/group';
  }

  single(_id: number): Promise<Group> {
    return this.http.get(this.route + '/' + _id)
      .map((response) => {
        return new Group().jsonFill(response);
      })
      .toPromise();
  }

  public get(): Promise<Group[]> {
    return this.http.get(this.route)
      .map((response) => {
        const jsonResponse = response.json();

        // Map the rows to the models.
        return jsonResponse.map((row) => {
            return new Group().jsonFill(row);
          });
      })
      .toPromise();
  }

  public post(group: Group): Promise<Group> {
    return this.http.post(this.route, group)
      .map((response) => {
        return new Group().jsonFill(response);
      })
      .toPromise();
  }

  public remove(group: Group): Promise<Object> {
    return this.http.delete(this.route + '/' + group._id)
      .map((response) => {
        return response.json();
      })
      .toPromise();
  }

  public patch(group: Group): Promise<Group> {
    return this.http.patch(this.route + '/' + group._id, group)
      .map((response) => {
        return new Group().jsonFill(response);
      })
      .toPromise();
  }
}
