import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {environment} from "../../environments/environment";
import Group from "../models/group.model";
import {RestInterface} from "./rest.interface";

@Injectable()
export default class GroupService implements RestInterface<Group> {

  /**
   *
   */
  private route: String;

  constructor(private http: Http) {
    this.route = environment.apiEndpoint + '/group';
  }

  single(_id: number): Promise<Group> {
    return null;
  }

  public get(): Promise<Group[]> {
    return null;
  }

  public post(): Promise<Group> {
    return null;
  }

  public remove(group: Group): Promise<Object> {
    return null;
  }

  public patch(group: Group): Promise<Group> {
    return null;
  }

}
