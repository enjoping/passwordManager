import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Invite from '../../models/invite.model';
import { RegisterService } from '../../services/register.service';
import {EventReceiver} from '../../services/event/event-receiver.interface';
import {EventService} from '../../services/event/event.service';


@Component({
  selector: 'pm-invite-page',
  templateUrl: './invite-page.component.html',
})
export class InvitePageComponent implements OnInit, EventReceiver {
  public invite: Invite;
  private shownEmail: string;
  private inviteToken: string;

  constructor(private registerService: RegisterService,
              private route: ActivatedRoute,
              private eventService: EventService) {
    this.eventService.subscribe(this);
  }

  ngOnInit() {
  }

  onEventReceived(source, key, value) {
    if (key === 'authorization-status-change'
        && value.authorized && value.user) {

      this.route.params.subscribe((params) => {
        const inviteToken = params['id'];
        // console.log(inviteToken);
        this.registerService.single(inviteToken)
          .then((invite) => {
            this.invite = invite;
            // TODO fix this if model json parser was fixed
            const obj = JSON.parse(invite._body); // JSON Object
            this.shownEmail = obj.email;
            this.inviteToken = obj.inviteToken;
          })
          .catch((error) => {
            console.log(error);
            // The invite couldn't be loaded.
            console.log('Your token is not valid.');
          });
      });
    }
  }
}
