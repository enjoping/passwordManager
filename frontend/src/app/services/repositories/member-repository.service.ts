import { Injectable } from '@angular/core';
import Group from '../../models/group.model';
import { ModelRepositoryService } from './model-repository.service';
import { LoginService } from '../login.service';
import Member from '../../models/member.model';
import { MemberService } from '../member.service';
import { EventService } from '../event/event.service';
import {UserRepositoryService} from './user-repository.service';


@Injectable()
export class MemberRepositoryService extends ModelRepositoryService<Member> {

  constructor(private memberService: MemberService,
              private userRepository: UserRepositoryService,
              eventService: EventService,
              loginService: LoginService) {
    super(memberService, eventService, loginService);
  }


  protected loadAdditionalModelInformation(model: Member): Promise<any> {
    return this.userRepository.get(model.id)
      .then((user) => {
        model.user = user;
        return Promise.resolve();
      });
  }

  setCurrentGroup(group: Group) {
    this.memberService.setCurrentGroup(group);
  }

  public createModel(): Member {
    return new Member({ _created: false });
  }
}
