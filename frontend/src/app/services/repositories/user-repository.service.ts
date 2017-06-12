import {Injectable} from '@angular/core';
import GroupService from '../group.service';
import Group from '../../models/group.model';
import {ModelRepositoryService} from './model-repository.service';
import {SecurityNoteRepositoryService} from './security-note-repository.service';
import User from '../../models/user.model';
import UserService from '../user.service';
import EventService from '../event/event.service';
import {LoginService} from '../login.service';
import {EventReceiver} from '../event/event-receiver.interface';


@Injectable()
export class UserRepositoryService extends ModelRepositoryService<User> {

  constructor(userService: UserService,
              eventService: EventService,
              loginService: LoginService) {
    super(userService, eventService, loginService);
  }
}
