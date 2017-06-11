import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pm-create-user-modal',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  tags = [ ];
  constructor(public activeModal: NgbActiveModal) { }

  tagAdded() {
    console.log('tag added');
  }
}
