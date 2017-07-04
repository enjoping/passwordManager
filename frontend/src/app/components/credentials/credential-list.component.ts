import {Component, Input, OnInit} from '@angular/core';
import { SecurityNoteRepositoryService } from '../../services/repositories/security-note-repository.service';
import SecurityNote from '../../models/security-note.model';
import {KeyStorageService} from '../../services/key-storage.service';
import Group from '../../models/group.model';
import {LoginService} from '../../services/login.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from '../dialogs/confirm-dialog.component';

@Component({
  selector: 'pm-credential-list',
  templateUrl: './credential-list.component.html',
  styleUrls: [ './credential-list.component.scss' ]
})
export class CredentialListComponent implements OnInit {
  @Input() group: Group;

  constructor(public securityNoteRepository: SecurityNoteRepositoryService,
              private keyStorage: KeyStorageService,
              private loginService: LoginService,
              private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.securityNoteRepository.setCurrentGroup(this.group);
    this.securityNoteRepository.loadModels().then();
  }

  showPassword(event, field) {
    this.keyStorage.getGroupKey(this.group, this.loginService.currentUser.username)
      .then((groupKey) => {
        this.keyStorage.decryptField(groupKey, field.value, field.counter)
          .then((decrypted) => {
            const container = document.createElement('div');
            container.innerHTML = this.keyStorage.ab2str8(decrypted);
            event.target.parentNode.replaceChild(container, event.target);
          });
      });
  }

  removeCredential(credential: SecurityNote) {
    const modalRef = this.modalService.open(ConfirmDialogComponent);
    modalRef.componentInstance.dialogTitle = 'Remove credentials.';
    modalRef.componentInstance.dialogContent = 'Do you really want to remove this credentials? '
      + 'The action cannot be undone.';

    modalRef.result
      .then((result) => {
      console.log(result);
        this.securityNoteRepository.deleteModel(credential)
          .then(() => {
            console.log('model deleted');
          });
      })
      .catch((result ) => { console.log('no', result); });
  }
}
