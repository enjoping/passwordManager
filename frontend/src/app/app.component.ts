import { Component } from '@angular/core';
import {GroupRepositoryService} from './services/repositories/group-repository.service';
import Group from './models/group.model';

@Component({
    selector: 'pm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(groupRepository: GroupRepositoryService) {
    groupRepository.groups.push(new Group({ _id: 0, name: 'Team Social Media' }));
    groupRepository.groups.push(new Group({ _id: 1, name: 'Team Marketing' }));
    groupRepository.groups.push(new Group({ _id: 2, name: 'Team Analytics' }));
  }
}
