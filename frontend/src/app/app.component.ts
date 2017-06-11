import { Component } from '@angular/core';
import {GroupRepositoryService} from './services/repositories/group-repository.service';
import Group from './models/group.model';
import {SecurityNoteRepositoryService} from './services/repositories/security-note-repository.service';
import SecurityNote from './models/security-note.model';
import SecurityNoteField from './models/security-note-field';
import User from './models/user.model';
import {UserRepositoryService} from './services/repositories/user-repository.service';

@Component({
    selector: 'pm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(groupRepository: GroupRepositoryService,
              securityNoteRepository: SecurityNoteRepositoryService,
              userRepository: UserRepositoryService) {


    const securityNoteInstagram = new SecurityNote({ _id: 0, name: 'Instagram', group: 0 });
    securityNoteInstagram.fields.push(new SecurityNoteField('Username', '@passwordmanager', 'string'));
    securityNoteInstagram.fields.push(new SecurityNoteField('Password', 'mysecretpassword', 'password'));


    const securityNoteFacebook = new SecurityNote({ _id: 0, name: 'Facebook', group: 0 });
    securityNoteFacebook.fields.push(new SecurityNoteField('Username', 'Passwordmanager', 'string'));
    securityNoteFacebook.fields.push(new SecurityNoteField('Password', 'mysecretpassword', 'password'));

    securityNoteRepository.addModels([ securityNoteInstagram, securityNoteFacebook ]);

    groupRepository.addModels([
      new Group({ _id: 0, name: 'Team Social Media' }),
      new Group({ _id: 1, name: 'Team Marketing' }),
      new Group({ _id: 2, name: 'Team Analytics' })
    ]);

    userRepository.addModels([
      new User({ _id: 0, name: 'Max Mustermann', email: 'MaMu@Mustermail.com' }),
      new User({ _id: 1, name: 'Moritz Mustermann', email: 'MoMu@Mustermail.com' })
    ]);
  }
}
