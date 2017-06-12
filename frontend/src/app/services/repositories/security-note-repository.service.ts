import {Injectable} from '@angular/core';
import GroupService from '../group.service';
import Group from '../../models/group.model';
import {ModelRepositoryService} from './model-repository.service';
import {SecurityNoteService} from '../security-note.service';
import SecurityNote from '../../models/security-note.model';
import EventService from '../event/event.service';
import {LoginService} from '../login.service';


@Injectable()
export class SecurityNoteRepositoryService extends ModelRepositoryService<SecurityNote> {

  constructor(noteService: SecurityNoteService,
              eventService: EventService,
              loginService: LoginService) {
    super(noteService, eventService, loginService);
  }
}
