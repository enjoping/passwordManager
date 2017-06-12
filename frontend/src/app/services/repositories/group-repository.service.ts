import {Injectable} from '@angular/core';
import GroupService from '../group.service';
import Group from '../../models/group.model';
import {ModelRepositoryService} from './model-repository.service';
import {SecurityNoteRepositoryService} from './security-note-repository.service';
import {DomEventsPlugin} from '@angular/platform-browser/src/dom/events/dom_events';
import EventService from '../event/event.service';
import {LoginService} from '../login.service';


/**
 * The {@link GroupRepositoryService} caches all groups for easy access.
 */
@Injectable()
export class GroupRepositoryService extends ModelRepositoryService<Group> {

  constructor(groupService: GroupService,
              eventService: EventService,
              loginService: LoginService,
              private securityNoteRepsitory: SecurityNoteRepositoryService) {
    super(groupService, eventService, loginService);
  }


  protected loadAdditionalModelInformation(model: Group) {
    this.securityNoteRepsitory
      .filter(securityNote => securityNote.group === model._id)
      .then(securityNotes => model.securityNotes = securityNotes);
  }

  createModel(): Group {
    return new Group({ '_created': false });
  }
}
