import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserRepositoryService} from '../../../services/repositories/user-repository.service';
import User from '../../../models/user.model';

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
              private userRepository: UserRepositoryService) { }

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

  createNewUsers() {
    let i = 0;
    for (const email of this.emailAddresses) {
      i++;
      const user: User = new User();
      user._created = false;
      user.email = email;
      user.password = this.generateRandom();
      user.username = this.generateRandom();
      user.publicKey = this.generateRandom();
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
  }

  generateRandom(): string {
    return '123456';
  }

}
