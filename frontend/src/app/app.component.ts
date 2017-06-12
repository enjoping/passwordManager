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
              securityNoteRepository: SecurityNoteRepositoryService,
              userRepository: UserRepositoryService,
              eventService: EventService) {

    eventService.subscribe(this);

    const securityNoteInstagram = new SecurityNote({ _id: 0, name: 'Instagram', group: 0 });
    securityNoteInstagram.fields.push(new SecurityNoteField('Username', '@passwordmanager', 'string'));
    securityNoteInstagram.fields.push(new SecurityNoteField('Password', 'mysecretpassword', 'password'));


    const securityNoteFacebook = new SecurityNote({ _id: 0, name: 'Facebook', group: 0 });
    securityNoteFacebook.fields.push(new SecurityNoteField('Username', 'Passwordmanager', 'string'));
    securityNoteFacebook.fields.push(new SecurityNoteField('Password', 'mysecretpassword', 'password'));

    securityNoteRepository.addModels([ securityNoteInstagram, securityNoteFacebook ]);

    this.groupRepository.addModels([
      new Group({ _id: 0, name: 'Team Social Media', owner: 'MaMu@Mustermail.com'}),
      new Group({ _id: 1, name: 'Team Marketing', owner: 'MaMu@Mustermail.com'}),
      new Group({ _id: 2, name: 'Team Analytics', owner: 'MoMu@Mustermail.com'})
    ]);

    userRepository.addModels([
      new User({ _id: 0, name: 'Max Mustermann', email: 'MaMu@Mustermail.com' }),
      new User({ _id: 1, name: 'Moritz Mustermann', email: 'MoMu@Mustermail.com' }),
      new User({ _id: 2, name: 'Sybille Mustermann', email: 'SyMu@Mustermail.com' })
    ]);
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
