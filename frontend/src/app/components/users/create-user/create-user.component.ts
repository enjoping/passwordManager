import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRepositoryService } from '../../../services/repositories/user-repository.service';
import { InviteRepositoryService } from '../../../services/repositories/invite-repository.service';
import Invite from '../../../models/invite.model';

@Component({
  selector: 'pm-create-user-modal',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  emailAddresses = [ ];
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

  createNewInvites() {
    let i = 0;
    for (const email of this.emailAddresses) {
      i++;
      const invite: Invite = new Invite({
        _created: false,
        email: email
      });
      if (i !== this.emailAddresses.length) {
        this.inviteRepository.saveModel(invite).then();
      } else {
        this.inviteRepository.saveModel(invite)
          .then(() => {
            this.activeModal.dismiss('success');
          });
      }
    }
    // window.location.reload();
  }
}
