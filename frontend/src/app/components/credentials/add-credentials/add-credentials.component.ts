import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import SecurityNote from '../../../models/security-note.model';
import SecurityNoteField from '../../../models/security-note-field';
import { ActivatedRoute } from '@angular/router';
import Group from '../../../models/group.model';
import { GroupRepositoryService } from '../../../services/repositories/group-repository.service';
import { SecurityNoteRepositoryService } from '../../../services/repositories/security-note-repository.service';
import { LoginService } from '../../../services/login.service';
import {KeyStorageService} from '../../../services/key-storage.service';

@Component({
  selector: 'pm-add-credential-modal',
  templateUrl: './add-credentials.component.html',
  styleUrls: [ './add-credentials.component.scss' ]
})
export class AddCredentialComponent implements OnInit {

  securityNote: SecurityNote;
  group: Group;

  constructor(public activeModal: NgbActiveModal,
              private securityNoteRepository: SecurityNoteRepositoryService,
              private loginService: LoginService,
              private keyStorage: KeyStorageService) {

    this.securityNote = this.securityNoteRepository.createModel();
  }

  ngOnInit(): void {
    this.securityNote.fields.push(new SecurityNoteField('Username', '', 'text'));
    this.securityNote.fields.push(new SecurityNoteField('Password', '', 'password'));
  }

  changeFieldType(index, value): void {
    this.securityNote.fields[index].fieldType =
      value ? 'password' : 'text';
  }

  addFieldToNote(keyInput, valueInput, typeInput): void {
    const key = keyInput.value;
    const value = valueInput.value;
    const type = typeInput.value ? 'password' : 'text';

    this.securityNote.fields.push(new SecurityNoteField(key, value, type));

    keyInput.value = valueInput.value = '';
  }

  createSecurityNote() {
    this.securityNote.group = this.group._id;

    this.keyStorage.getGroupKey(this.group, this.loginService.currentUser.username)
      .then((groupKey) => {
        return this.keyStorage.encryptSecurityNoteFields(groupKey, this.securityNote);
      })
      .then((encryptedSecurityNote) => {
        this.securityNoteRepository.setCurrentGroup(this.group);
        this.securityNoteRepository.saveModel(encryptedSecurityNote)
          .then((securityNote) => {
            // We successfully crated a new security note.
            this.activeModal.dismiss('success');
          });
      });



  }
}
