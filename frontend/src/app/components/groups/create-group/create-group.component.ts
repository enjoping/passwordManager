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
import Member from '../../../models/member.model';


@Component({
  selector: 'pm-create-group-modal',
  templateUrl: './create-group.component.html',
  styleUrls: [ './create-group.component.scss' ]
})
export class CreateGroupComponent {
  group: Group;

  // The group members that should be created.
  members: Member[];

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
      member.id = user._id;
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
    // Save the members in an extra variable, because the group will be override on saving.
    this.members = this.group.members;

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
        return this.groupRepository.saveModel(this.group);
      })
      .then((group: Group) => {
        // The group has been created.
        return this.keyStorage.getGroupKey(group, this.loginService.currentUser.username);
      })
      .then((groupKey) => {
        const promises = [ ];

        this.members.forEach((member) => {
          if (member._created) {
            // The member has already been created.
            return;
          }

          promises.push(
            this.keyStorage.importKey(member.user.publicKey)
              .then((publicKey) => {
                return this.keyStorage.encrypt(publicKey, this.keyStorage.ab2str8(groupKey));
              })
              .then((encryptedPassword) => {
                member.password = this.keyStorage.ab2str8(encryptedPassword);
                member.group = this.group._id;

                this.memberRepository.setCurrentGroup(this.group);
                return this.memberRepository.saveModel(member);
              })
          );
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
