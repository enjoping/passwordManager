
import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import SecurityNote from '../../../models/security-note.model';
import SecurityNoteField from '../../../models/security-note-field';
@Component({
  selector: 'pm-add-credential-modal',
  templateUrl: './add-credentials.component.html',
  styleUrls: [ './add-credentials.component.scss' ]
})
export class AddCredentialComponent implements OnInit {

  securityNote: SecurityNote = new SecurityNote();

  constructor(public activeModal: NgbActiveModal) {

  }

  ngOnInit(): void {
    this.securityNote.fields.push(new SecurityNoteField('Username', '', 'text'));
    this.securityNote.fields.push(new SecurityNoteField('Password', '', 'password'));
  }

  addFieldToNote(keyInput, valueInput): void {
    const key = keyInput.value;
    const value = valueInput.value;

    this.securityNote.fields.push(new SecurityNoteField(key, value, 'text'));

    keyInput.value = valueInput.value = '';
  }
}
