import { Injectable } from '@angular/core';
import Group from '../../models/group.model';
import { ModelRepositoryService } from './model-repository.service';
import { SecurityNoteService } from '../security-note.service';
import SecurityNote from '../../models/security-note.model';
import EventService from '../event/event.service';
import { LoginService } from '../login.service';


@Injectable()
export class SecurityNoteRepositoryService extends ModelRepositoryService<SecurityNote> {

  constructor(private noteService: SecurityNoteService,
              eventService: EventService,
              loginService: LoginService) {
    super(noteService, eventService, loginService);
  }

  setCurrentGroup(group: Group) {
    this.noteService.setCurrentGroup(group);
  }

  public createModel(): SecurityNote {
    return new SecurityNote({ _created: false });
  }
}
