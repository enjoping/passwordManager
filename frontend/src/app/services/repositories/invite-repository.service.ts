import {Injectable} from '@angular/core';
import {GroupService} from '../group.service';
import Group from '../../models/group.model';
import {ModelRepositoryService} from './model-repository.service';
import {SecurityNoteRepositoryService} from './security-note-repository.service';
import User from '../../models/user.model';
import {UserService} from '../user.service';
import EventService from '../event/event.service';
import {LoginService} from '../login.service';
import {EventReceiver} from '../event/event-receiver.interface';
import Invite from '../../models/invite.model';
import {InviteService} from '../invite.service';


@Injectable()
export class InviteRepositoryService extends ModelRepositoryService<Invite> {

  constructor(inviteService: InviteService,
              eventService: EventService,
              loginService: LoginService) {
    super(inviteService, eventService, loginService);
  }
}
