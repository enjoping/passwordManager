import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pm-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  @Input() email = '';

  private tokenMail: string;

  constructor() { }

  ngOnInit() {
    this.tokenMail = 'noch@nicht.implementiert';
  }

}
