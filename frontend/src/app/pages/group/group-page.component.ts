import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import Group from '../../models/group.model';
import { GroupRepositoryService } from '../../services/repositories/group-repository.service';
import { AddCredentialComponent } from '../../components/credentials/add-credentials/add-credentials.component';

@Component({
  selector: 'pm-group-page',
  templateUrl: './group-page.component.html'
})
export class GroupPageComponent implements OnInit {

  public group: Group;

  constructor(private modalService: NgbModal,
              private route: ActivatedRoute,
              private groupRepository: GroupRepositoryService) { }

  openModal() {
    const modalRef = this.modalService.open(AddCredentialComponent, { 'size': 'lg' });
    modalRef.componentInstance.group = this.group;
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
