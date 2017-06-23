import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserRepositoryService} from '../../../services/repositories/user-repository.service';
import User from '../../../models/user.model';
import {InviteRepositoryService} from '../../../services/repositories/invite-repository.service';
import Invite from '../../../models/invite.model';

@Component({
  selector: 'pm-create-user-modal',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  emailAddresses = [ ];

  availableAddresses = [
    'lukas.schardt@stud.h-da.de'
  ];
  email = '';

  constructor(public activeModal: NgbActiveModal,
              private userRepository: UserRepositoryService,
              private inviteRepository: InviteRepositoryService
  ) { }

  addNewEmail(emailInput) {
    this.emailAddresses.push(emailInput.value);

    emailInput.value = '';
  }

  removeUser(email): void {
    const index = this.emailAddresses.findIndex((v => v === email));
    if (index > -1) {
      this.emailAddresses.splice(index, 1);
    }
  }

  /*createNewUsers() {
    let i = 0;
    for (const email of this.emailAddresses) {
      i++;
      const user: User = new User();
      user._created = false;
      user.email = email;
      user.password = this.generateRandom(8, '#aA');
      user.username = this.generateRandom(8, 'a');
      user.publicKey = this.generateRandom(64, '#aA!');
      user.pendingInvite = true;
      if (i !== this.emailAddresses.length) {
        this.userRepository.saveModel(user);
      } else {
        this.userRepository.saveModel(user)
          .then(() => {
            this.activeModal.dismiss('success');
          });
      }
    }
    // TODO remove once repository gets ID correctly after adding a user
    window.location.reload();
  }*/

  createNewInvites() {
    let i = 0;
    for (const email of this.emailAddresses) {
      i++;
      const invite: Invite = new Invite();
      invite._created = false;
      invite.email = email;
      if (i !== this.emailAddresses.length) {
        this.inviteRepository.saveModel(invite);
      } else {
        this.inviteRepository.saveModel(invite)
          .then(() => {
            this.activeModal.dismiss('success');
          });
      }
    }
    // window.location.reload();
  }

  generateRandom(length, chars): string {
    let mask = '';
    if (chars.indexOf('a') > -1) { mask += 'abcdefghijklmnopqrstuvwxyz'; }
    if (chars.indexOf('A') > -1) { mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
    if (chars.indexOf('#') > -1) { mask += '0123456789'; }
    if (chars.indexOf('!') > -1) { mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\'; }
    let result = '';
    for (let i = length; i > 0; --i) { result += mask[Math.floor(Math.random() * mask.length)]; }
    return result;
  }
}
