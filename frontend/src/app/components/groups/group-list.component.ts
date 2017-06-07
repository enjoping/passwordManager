import {Component, Input, OnInit} from '@angular/core';
import Group from '../../models/group.model';
import {GroupRepositoryService} from '../../services/repositories/group-repository.service';

@Component({
  selector: 'pm-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: [ './group-list.component.scss' ]
})
export class GroupListComponent implements OnInit {

  groups: Promise<Group[]>;

  constructor(private groupRepository: GroupRepositoryService) { }

  ngOnInit(): void {
    this.groups = this.groupRepository.all();
  }
}
