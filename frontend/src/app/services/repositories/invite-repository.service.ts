import { Injectable } from '@angular/core';
import { ModelRepositoryService } from './model-repository.service';
import { LoginService } from '../login.service';
import Invite from '../../models/invite.model';
import { InviteService } from '../invite.service';
import { EventService } from '../event/event.service';


@Injectable()
export class InviteRepositoryService extends ModelRepositoryService<Invite> {

  constructor(inviteService: InviteService,
              eventService: EventService,
              loginService: LoginService) {
    super(inviteService, eventService, loginService);
  }
}
