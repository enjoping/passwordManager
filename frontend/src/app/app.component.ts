import { Component } from '@angular/core';
import { GroupRepositoryService } from './services/repositories/group-repository.service';
import EventService from './services/event/event.service';
import { EventReceiver } from './services/event/event-receiver.interface';

@Component({
    selector: 'pm-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements EventReceiver {

  constructor(private groupRepository: GroupRepositoryService,
              eventService: EventService) {

    eventService.subscribe(this);
  }


  onEventReceived(source, key, value) {
    console.log(key, value);
    if (key === 'authorization-status-change') {
      if (value.authorized === true) {
        this.groupRepository.loadModels().then();
      }
    }
  }
}
