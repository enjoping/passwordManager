import { Component, OnInit } from '@angular/core';
import { GroupRepositoryService } from '../../../services/repositories/group-repository.service';
import Group from '../../../models/group.model';
import { UserRepositoryService } from '../../../services/repositories/user-repository.service';
import User from '../../../models/user.model';

@Component({
  selector: 'pm-admin-groups',
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.scss']
})
export class AdminGroupsComponent implements OnInit {

  groups: Promise<Group[]>;
  users: Promise<User[]>;
  usersResolved: User[];
  editGroupId: any;
  editGroupName: any;
  editGroupOwner: any;

  constructor(private groupRepository: GroupRepositoryService,
              private userRepository: UserRepositoryService) {}

  ngOnInit(): void {
    this.users = this.userRepository.all()
      .then(users => this.usersResolved = users);
    this.groups = this.groupRepository.all();
    this.editGroupId = -1;
    this.editGroupName = '';
    this.editGroupOwner = '';
  }

  remove(group: Group) {
    this.groupRepository.deleteModel(group);
  }

  edit(group: Group) {
    if (group) {
      this.editGroupId = group._id;
      this.editGroupName = group.name;
      this.editGroupOwner = group.user;
    } else {
      this.editGroupId = -1;
      this.editGroupName = '';
      this.editGroupOwner = '';
    }
  }

  update(group: Group) {
    if (group.user = this.getUserById(group.owner)) {
        this.groupRepository.saveModel(group);
    }
  }

  getUserById(userId): User {
    for (let _i = 0; _i < this.usersResolved.length; _i++) {
      if (this.usersResolved[_i]._id === +userId) {
        return this.usersResolved[_i];
      }
    }
    return null;
  }
  emailForOwnerId(userId): string {
    for (let _i = 0; _i < this.usersResolved.length; _i++) {
      if (this.usersResolved[_i]._id === +userId) {
        return this.usersResolved[_i].email;
      }
    }
    return '';
  }
}
