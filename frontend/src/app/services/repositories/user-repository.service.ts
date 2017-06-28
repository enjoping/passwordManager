import { Injectable } from '@angular/core';
import { ModelRepositoryService } from './model-repository.service';
import User from '../../models/user.model';
import { UserService } from '../user.service';
import { LoginService } from '../login.service';
import { EventService } from '../event/event.service';


@Injectable()
export class UserRepositoryService extends ModelRepositoryService<User> {

  constructor(userService: UserService,
              eventService: EventService,
              loginService: LoginService) {
    super(userService, eventService, loginService);
  }
}
