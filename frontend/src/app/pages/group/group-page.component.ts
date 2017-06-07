import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateGroupComponent} from '../../components/groups/create-group/create-group.component';
import {ActivatedRoute} from '@angular/router';
import Group from '../../models/group.model';
import {GroupRepositoryService} from '../../services/repositories/group-repository.service';

@Component({
  selector: 'pm-group-page',
  templateUrl: './group-page.component.html'
})
export class GroupPageComponent implements OnInit {

  private group: Group;

  constructor(private modalService: NgbModal,
              private route: ActivatedRoute,
              private groupRepository: GroupRepositoryService) {

  }

  openModal() {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const groupId = +params['id'];

      this.groupRepository.get(groupId)
        .then((group) => {
          this.group = group;
        })
        .catch(() => {
          // The group couldn't be loaded.
        });
    });
  }
}
