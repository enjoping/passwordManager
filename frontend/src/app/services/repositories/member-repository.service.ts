import { Injectable } from '@angular/core';
import Group from '../../models/group.model';
import { ModelRepositoryService } from './model-repository.service';
import { LoginService } from '../login.service';
import Member from '../../models/member.model';
import { MemberService } from '../member.service';
import { EventService } from '../event/event.service';


@Injectable()
export class MemberRepositoryService extends ModelRepositoryService<Member> {

  constructor(private memberService: MemberService,
              eventService: EventService,
              loginService: LoginService) {
    super(memberService, eventService, loginService);
  }

  setCurrentGroup(group: Group) {
    this.memberService.setCurrentGroup(group);
  }

  public createModel(): Member {
    return new Member({ _created: false });
  }
}
