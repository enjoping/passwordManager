import { Component } from '@angular/core';
import { GroupRepositoryService } from './services/repositories/group-repository.service';
import { EventReceiver } from './services/event/event-receiver.interface';
import { EventService } from './services/event/event.service';
import {KeyStorageService} from './services/key-storage.service';
import {LoginService} from './services/login.service';
import {UserRepositoryService} from './services/repositories/user-repository.service';

@Component({
    selector: 'pm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements EventReceiver {

  constructor(private groupRepository: GroupRepositoryService,
              private userRepository: UserRepositoryService,
              eventService: EventService,
              private loginService: LoginService,
              keyStorage: KeyStorageService) {

    eventService.subscribe(this);
    this.loginService.loadAccessTokenFromStorage();


    keyStorage.open().then(() => {
      keyStorage.listKeys()
        .then((result) => {
          console.log('key loaded', result);
        });
    });

  }


  onEventReceived(source, key, value) {
    if (key === 'authorization-status-change') {
      if (value.authorized === true) {
        this.userRepository.loadModels()
          .then(() => {
            if (value.userId) {
              const user = this.userRepository.models.find(row => row._id === +value.userId);
              // The user has not been loaded. Load the user.
              this.loginService.setCurrentUser(user);
            }
          });
        this.groupRepository.loadModels().then();
      }
    }
  }
}
