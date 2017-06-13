import {Component, Input, OnInit} from '@angular/core';
import Group from '../../models/group.model';
import {GroupRepositoryService} from '../../services/repositories/group-repository.service';
import {SecurityNoteRepositoryService} from '../../services/repositories/security-note-repository.service';
import SecurityNote from '../../models/security-note.model';

@Component({
  selector: 'pm-credential-list',
  templateUrl: './credential-list.component.html',
  styleUrls: [ './credential-list.component.scss' ]
})
export class CredentialListComponent {

  @Input() credentials: SecurityNote[];

  constructor(private securityNoteRepository: SecurityNoteRepositoryService) { }

  removeCredential(credential: SecurityNote) {
    this.securityNoteRepository.deleteModel(credential);
  }
}
