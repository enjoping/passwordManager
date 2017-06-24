import { Component, Input, OnInit } from '@angular/core';
import User from '../../models/user.model';
import { UserRepositoryService } from 'app/services/repositories/user-repository.service';
import {Router} from '@angular/router';
import { LoginService } from 'app/services/login.service';
import InviteService from "app/services/invite.service";

@Component({
  selector: 'pm-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  @Input() mail = '';
  @Input() invitetoken = '';
  registrationFailed = false;
  loginFailed = false;
  passwordsMatch = false;

  constructor(private userRepository: UserRepositoryService,
              private loginService: LoginService,
              private router: Router,
              private inviteService: InviteService) { }

  ngOnInit() {
  }

  createNewUser(username, password, password2) {
    if (this.passMatch(password, password2) && (username !== '') && (password !== '')) {
        const user: User = new User();
        user._created = false;
        user.email = this.mail;
        user.password = password;
        user.username = username;
        user.publicKey = this.generateRandom(64, '#aA!');
        user.pendingInvite = true;
        this.userRepository.saveModel(user)
          .then(() => {
            this.login(username, password);
          })
          .then(() => {
            // TODO DELETE INVITE TOKEN after registration/login?
            // this.inviteService.remove(this.invitetoken);
          })
          .catch((status) => {
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

  login(username: string, password: string) {
    this.loginService.login(username, password)
      .then(() => {

        // The login was successful. Load the current user.
        this.userRepository.loadModels()
          .then(() => {

            this.loginService.setCurrentUser(this.userRepository.models.find(model => model.username === username));

            // Navigate to the groups page.
            this.router.navigate([ '/groups' ]);
          });
      })
      .catch((status) => {
        this.loginFailed = true;
      });
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
