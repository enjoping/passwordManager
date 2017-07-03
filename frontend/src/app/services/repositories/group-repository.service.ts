import { Injectable } from '@angular/core';
import { GroupService } from '../group.service';
import Group from '../../models/group.model';
import { ModelRepositoryService } from './model-repository.service';
import { SecurityNoteRepositoryService } from './security-note-repository.service';
import { LoginService } from '../login.service';
import { EventService } from '../event/event.service';
import {MemberRepositoryService} from './member-repository.service';


/**
 * The {@link GroupRepositoryService} caches all groups for easy access.
 */
@Injectable()
export class GroupRepositoryService extends ModelRepositoryService<Group> {

  constructor(groupService: GroupService,
              eventService: EventService,
              loginService: LoginService,
              private securityNoteRepository: SecurityNoteRepositoryService,
              private memberRepository: MemberRepositoryService) {
    super(groupService, eventService, loginService);
  }


  protected loadAdditionalModelInformation(model: Group) {
    // Set the current group so the security note repository knows which notes to load.
    this.securityNoteRepository.setCurrentGroup(model);

    return this.securityNoteRepository.loadModels()
      .then(() => {
        model.securityNotes = this.securityNoteRepository.models;

        this.memberRepository.setCurrentGroup(model);
        return this.memberRepository.loadModels();
      })
      .then(() => {
        model.members = this.memberRepository.models;
        return Promise.resolve();
      });
  }

  createModel(): Group {
    return new Group({ '_created': false });
  }
}
