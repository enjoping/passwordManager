import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { UserRepositoryService } from '../../../services/repositories/user-repository.service';
import Group from '../../../models/group.model';
import { GroupRepositoryService } from '../../../services/repositories/group-repository.service';
import { LoginService } from '../../../services/login.service';
import { MemberRepositoryService } from '../../../services/repositories/member-repository.service';
import {KeyStorageService} from '../../../services/key-storage.service';


@Component({
  selector: 'pm-create-group-modal',
  templateUrl: './create-group.component.html',
  styleUrls: [ './create-group.component.scss' ]
})
export class CreateGroupComponent {
  group: Group;

  constructor(public activeModal: NgbActiveModal,
              private userRepository: UserRepositoryService,
              private groupRepository: GroupRepositoryService,
              private memberRepository: MemberRepositoryService,
              private loginService: LoginService,
              private keyStorage: KeyStorageService) {

    this.group = this.groupRepository.createModel();
    this.group.user = this.loginService.currentUser;
  }


  search = (text: Observable<String>) => {
    return text
      .debounceTime(200)
      .distinctUntilChanged()
      .map((term) => {
        if (term.length < 2) {
          return [ ];
        }

        return this.userRepository.models.filter(v => v.email.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .map(model => model.email);
      });
  }

  addNewUser(emailInput) {
    const email = emailInput.value;

    const user = this.userRepository.models
      .find((model => model.email === email));

    if (!user) {
      // There is no user with this email.
    } else {
      // Create a new member from the user. The password will be set by the server.
      const member = this.memberRepository.createModel();
      member.jsonFill({ password: 'random-password' });
      member.user = user;
      member.id = -1;
      member.group = this.group._id;
      this.group.members.push(member);

      // Reset the email input.
      emailInput.value = '';
    }
  }

  removeUser(email): void {
    const index = this.group.members.findIndex((v => v.user.email === email));
    if (index > -1) {
      this.group.members.splice(index, 1);
    }
  }

  createGroup(): void {
    // Generate the password for the group to be used to encrypt/decrypt the security notes.
    this.keyStorage.generateGroupKeyPair()
      .then((keyPair) => {
        return this.keyStorage.exportRawKey(keyPair);
      })
      .then((password) => {
        return this.keyStorage.getKey('name',
            'passwordManager_' + this.loginService.currentUser.username)
          .then((key) => {
            return this.keyStorage.encrypt(key.publicKey, this.keyStorage.ab2str8(password));
          });
      })
      .then((encryptedPassword) => {
        this.group.password = this.keyStorage.ab2str8(encryptedPassword);
        console.log('group password generated', this.group.password);
        return this.groupRepository.saveModel(this.group);
      })
      .then((group) => {
        console.log('group created', group);
        // The group has been created.
        const promises = [ ];
        this.memberRepository.setCurrentGroup(this.group);
        this.group.members.forEach((member) => {
          member.group = group._id;
          promises.push(this.memberRepository.saveModel(member));
        });
        return Promise.all(promises);
      })
      .then(() => {
        this.activeModal.dismiss('success');
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
}
