import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pm-add-credential-modal',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: [ './confirm-dialog.component.scss' ]
})
export class ConfirmDialogComponent {

  public dialogTitle: String;
  public dialogContent: String;

  public buttonPositiveText = 'Yes';
  public buttonNegativeText = 'No';

  constructor(public activeModal: NgbActiveModal) {
  }

  buttonPositiveClick() {
    this.activeModal.close('positive');
  }

  buttonNegativeClick() {
    this.activeModal.dismiss('negative');
  }
}
