import { Component, OnInit } from '@angular/core';
import {GroupRepositoryService} from '../../../services/repositories/group-repository.service';
import Group from '../../../models/group.model';

@Component({
  selector: 'pm-admin-groups',
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.scss']
})
export class AdminGroupsComponent implements OnInit {

  groups: Promise<Group[]>;

  constructor(private groupReposity: GroupRepositoryService) {


  }

  ngOnInit(): void {
    this.groups = this.groupReposity.all();
  }

}
