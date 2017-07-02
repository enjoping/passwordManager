import { Component, Input, OnInit } from '@angular/core';
import User from '../../models/user.model';
import { UserRepositoryService } from 'app/services/repositories/user-repository.service';
import { Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import {KeyStorageService} from '../../services/key-storage.service';
import {EventService} from '../../services/event/event.service';

@Component({
  selector: 'pm-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent {
  @Input() mail = '';
  @Input() invitetoken = '';
  registrationFailed = false;
  passwordsMatch = false;

  constructor(private userRepository: UserRepositoryService,
              private router: Router,
              private eventService: EventService,
              private keyStorageService: KeyStorageService) { }

  createNewUser(username, password, password2) {
    if (this.passMatch(password, password2) && (username !== '') && (password !== '')) {
      // We can work with the data the user entered.

      this.keyStorageService.generateKeypair()
        .then((keyPair) => {
          // Retrieve the public key from the generated key pair.
          return this.keyStorageService.exportKey(keyPair.publicKey)
            .then((publicKey) => {
              // We successfully created the public key. Create the user.
              const user = this.userRepository.createModel();
              user.jsonFill({
                email: this.mail,
                password: password,
                username: username,
                publicKey: publicKey,
                pendingInvite: true,
              });

              return this.userRepository.saveModel(user);
            })
            .then(() => {
              return this.keyStorageService.saveKey(keyPair.publicKey, keyPair.privateKey, 'passwordManager_' + username);
            });
        })
        .then(() => {
          // The user has been created. Navigate to the login page.
          this.router.navigate([ '/' ]).then();
        })
        .catch((error) => {
          // Something went wrong.
          this.registrationFailed = true;
        });
    } else {
      this.registrationFailed = true;
    }
  }

  passMatch(password, password2): boolean {
    this.passwordsMatch = (password === password2);
    return this.passwordsMatch;
  }
}
