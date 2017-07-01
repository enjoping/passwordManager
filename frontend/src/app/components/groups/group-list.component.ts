import { Component, OnInit } from '@angular/core';
import Group from '../../models/group.model';
import { GroupRepositoryService } from '../../services/repositories/group-repository.service';
import { SecurityNoteRepositoryService } from '../../services/repositories/security-note-repository.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog.component';

@Component({
  selector: 'pm-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: [ './group-list.component.scss' ]
})
export class GroupListComponent implements OnInit {

  groups: Promise<Group[]>;

  constructor(private groupRepository: GroupRepositoryService,
              private securityNoteRepository: SecurityNoteRepositoryService,
              private router: Router,
              private modalService: NgbModal) {


  }

  ngOnInit(): void {
    this.groups = this.groupRepository.all();
  }

  navigateToGroup(group) {
    this.router.navigate([ '/group', group._id ]);
  }

  removeGroup(group) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.dialogTitle = 'Remove group.';
    modalRef.componentInstance.dialogContent = 'Do you really want to remove this group and all security notes in this group? '
      + 'The action cannot be undone.';

    modalRef.result
      .then((result) => {
        const securityNotePromises = [ ];
        group.securityNotes.forEach((securityNote) => {
          this.securityNoteRepository.deleteModel(securityNote);
        });
        this.groupRepository.deleteModel(group);
      })
      .catch((result ) => { });
  }
}
