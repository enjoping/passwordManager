
import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'pm-create-group-modal',
  templateUrl: './create-group.component.html',
  styleUrls: [ './create-group.component.scss' ]
})
export class CreateGroupComponent {
  tags = [ ];

  constructor(public activeModal: NgbActiveModal) {

  }

  tagAdded() {
    console.log('tag added');
  }
}
