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
    this.keyStorage.getGroupKey(this.group, this.loginService.currentUser.username)
      .then((groupKey) => {
        console.log('group key received');
        // Decrypt the credentials.
        this.credentials.forEach((securityNote) => {
          console.log('security note', securityNote);
          securityNote.fields.forEach((field) => {
            if(field.fieldType === 'password') {
              console.log('decrypting password field', field.value);
              this.keyStorage.decryptField(groupKey, field.value, field.counter)
                .then((decrypted) => {
                  field.value = this.keyStorage.ab2str8(decrypted);
                  console.log('password field decrypted', field.value);
                });
            }
          });
        });
      });
  }

  removeCredential(credential: SecurityNote) {
    this.securityNoteRepository.deleteModel(credential);
  }
}
