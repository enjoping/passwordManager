import {Component} from '@angular/core';
import {LoginService} from '../../services/login.service';
import EventService from '../../services/event/event.service';
import {Router} from '@angular/router';
import {UserRepositoryService} from '../../services/repositories/user-repository.service';

@Component({
  selector: 'pm-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {

  /**
   * Will be set to <code>true</code> if the login failed.
   *
   * @type {boolean}
   */
  loginFailed = false;

  constructor(private loginService: LoginService,
              private userRepository: UserRepositoryService,
              private router: Router) {  }


  login(username: string, password: string) {
    this.loginService.login(username, password)
      .then(() => {

        // The login was successful. Load the current user.
        this.userRepository.loadModels()
          .then(() => {

            this.loginService.currentUser = this.userRepository.models.find(model => model.username === username);

            // Navigate to the groups page.
            this.router.navigate([ '/groups' ]);
          });
      })
      .catch((status) => {
        this.loginFailed = true;
      });
  }
}
