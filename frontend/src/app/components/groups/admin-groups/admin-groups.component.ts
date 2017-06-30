import { Component, OnInit } from '@angular/core';
import { GroupRepositoryService } from '../../../services/repositories/group-repository.service';
import Group from '../../../models/group.model';

@Component({
  selector: 'pm-admin-groups',
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.scss']
})
export class AdminGroupsComponent implements OnInit {

  groups: Promise<Group[]>;

  editGroupId: any;
  editGroupName: any;
  editGroupOwner: any;

  constructor(private groupRepository: GroupRepositoryService) {

  }

  ngOnInit(): void {
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
    console.log(group.name + ' ' + group.user);
    this.groupRepository.saveModel(group);
  }
}
