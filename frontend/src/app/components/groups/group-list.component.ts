import {Component, Input, OnInit} from '@angular/core';
import Group from '../../models/group.model';
import {GroupRepositoryService} from '../../services/repositories/group-repository.service';
import {SecurityNoteRepositoryService} from '../../services/repositories/security-note-repository.service';
import SecurityNote from '../../models/security-note.model';
import {Router} from '@angular/router';

@Component({
  selector: 'pm-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: [ './group-list.component.scss' ]
})
export class GroupListComponent implements OnInit {

  groups: Promise<Group[]>;

  constructor(private groupRepository: GroupRepositoryService,
              private securityNoteRepository: SecurityNoteRepositoryService,
              private router: Router) {


  }

  ngOnInit(): void {
    this.groups = this.groupRepository.all();
  }

  navigateToGroup(group) {
    this.router.navigate([ '/group', group._id ]);
  }
}
