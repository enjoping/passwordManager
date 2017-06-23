import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import Invite from '../../models/invite.model';
import InviteService from 'app/services/invite.service';

@Component({
  selector: 'pm-invite-page',
  templateUrl: './invite-page.component.html',
})
export class InvitePageComponent implements OnInit {
  private invite: Invite;
  constructor(private inviteService: InviteService,
              private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const inviteToken = params['id'];
      console.log(inviteToken);
      this.inviteService.single(inviteToken)
        .then((invite) => {
          this.invite = invite;
        })
        .catch(() => {
          // The invite couldn't be loaded.
          console.log('Your token is not valid.');
        });
    });
  }
}
