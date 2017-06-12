import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserRepositoryService} from '../../../services/repositories/user-repository.service';

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
}
