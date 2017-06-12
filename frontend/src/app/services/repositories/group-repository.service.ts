import {Injectable} from '@angular/core';
import GroupService from '../group.service';
import Group from '../../models/group.model';
import {ModelRepositoryService} from './model-repository.service';
import {SecurityNoteRepositoryService} from './security-note-repository.service';


/**
 * The {@link GroupRepositoryService} caches all groups for easy access.
 */
@Injectable()
export class GroupRepositoryService extends ModelRepositoryService<Group> {

  constructor(groupService: GroupService,
              private securityNoteRepsitory: SecurityNoteRepositoryService) {
    super(groupService);
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
