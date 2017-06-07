import {Injectable} from '@angular/core';
import GroupService from '../group.service';
import Group from '../../models/group.model';


/**
 * The {@link GroupRepositoryService} caches all groups for easy access.
 */
@Injectable()
export class GroupRepositoryService {

  public groups: Group[] = [ ];

  constructor(private groupService: GroupService) { }

  get(_id: number): Promise<Group> {
    return new Promise(
      (resolve, reject) => {
        const group = this.groups.find(row => row._id === _id);

        if (!group) {
          // There is no group with this id.
          reject();
        } else {
          // We found the group.
          resolve(group);
        }
      }
    );
  }

  all(): Promise<Group[]> {
    return Promise.resolve(this.groups);
  }
}
