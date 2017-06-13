import { Component } from '@angular/core';
import {GroupRepositoryService} from './services/repositories/group-repository.service';
import Group from './models/group.model';
import {SecurityNoteRepositoryService} from './services/repositories/security-note-repository.service';
import SecurityNote from './models/security-note.model';
import SecurityNoteField from './models/security-note-field';
import User from './models/user.model';
import {UserRepositoryService} from './services/repositories/user-repository.service';
import EventService from './services/event/event.service';
import {EventReceiver} from './services/event/event-receiver.interface';

@Component({
    selector: 'pm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements EventReceiver {

  constructor(private groupRepository: GroupRepositoryService,
              private securityNoteRepository: SecurityNoteRepositoryService,
              userRepository: UserRepositoryService,
              eventService: EventService) {

    eventService.subscribe(this);
  }


  onEventReceived(source, key, value) {
    console.log(key, value);
    if (key === 'authorization-status-change') {
      if (value.authorized === true) {
        this.groupRepository.loadModels().then();
      }
    }
  }
}
