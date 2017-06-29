import { Component, Input, OnInit } from '@angular/core';
import User from '../../models/user.model';
import { UserRepositoryService } from 'app/services/repositories/user-repository.service';
import { Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
declare var KeyManager: any;
declare var MyData: any;
// declare function testCallIndex(): any;

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
  // keyStore = new AngularIndexedDB('KeyStore', 1);

  constructor(private userRepository: UserRepositoryService,
              private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
    // console.log(testCallIndex());
    // console.log(MyData.domain);
    // console.log(KeyManager.test());
  }

  createNewUser(username, password, password2) {
    var that = this;
    if (this.passMatch(password, password2) && (username !== '') && (password !== '')) {
      const user: User = new User();
      user._created = false;
      user.email = this.mail;
      user.password = password;
      user.username = username;
      user.pendingInvite = true;

      KeyManager.generateKeypair().then(function (key) {
        KeyManager.exportKey(key.publicKey).then((publicKey) => {
          //create user with publicKey
          user.publicKey = publicKey;
          that.userRepository.saveModel(user)
            .then(() => {
              MyData.keyStore.saveKey(key.publicKey, key.privateKey, 'passwordManager_' + username);
              that.login(username, password);
            })
            .then(() => {
              // TODO DELETE INVITE TOKEN after registration/login?
              // this.inviteService.remove(this.invitetoken);
            })
            .catch((status) => {
              that.registrationFailed = true;
            });
        });
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
}
