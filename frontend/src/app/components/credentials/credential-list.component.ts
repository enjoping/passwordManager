import {Component, Input, OnInit} from '@angular/core';
import { SecurityNoteRepositoryService } from '../../services/repositories/security-note-repository.service';
import SecurityNote from '../../models/security-note.model';
import {KeyStorageService} from '../../services/key-storage.service';
import Group from '../../models/group.model';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'pm-credential-list',
  templateUrl: './credential-list.component.html',
  styleUrls: [ './credential-list.component.scss' ]
})
export class CredentialListComponent implements OnInit{

  @Input() group: Group;
  @Input() credentials: SecurityNote[];

  constructor(private securityNoteRepository: SecurityNoteRepositoryService,
              private keyStorage: KeyStorageService,
              private loginService: LoginService) { }


  ngOnInit(): void {
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
    this.securityNoteRepository.deleteModel(credential);
  }
}
