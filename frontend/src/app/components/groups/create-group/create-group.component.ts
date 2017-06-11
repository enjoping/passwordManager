
import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {UserRepositoryService} from '../../../services/repositories/user-repository.service';


@Component({
  selector: 'pm-create-group-modal',
  templateUrl: './create-group.component.html',
  styleUrls: [ './create-group.component.scss' ]
})
export class CreateGroupComponent {
  emailAddresses = [ ];

  availableAddresses = [
    'lukas.schardt@stud.h-da.de'
  ];

  email = '';

  constructor(public activeModal: NgbActiveModal,
              private userRepository: UserRepositoryService) {

  }


  search = (text: Observable<String>) => {
    return text
      .debounceTime(200)
      .distinctUntilChanged()
      .map((term) => {
        return term.length < 2
          ? [ ]
          : this.availableAddresses.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).splice(0, 10);
      });
  };

  addNewEmail(emailInput) {
    this.emailAddresses.push(emailInput.value);

    emailInput.value = '';
  }

  removeUser(email): void {
    const index = this.emailAddresses.findIndex((v => v === email));
    if (index > -1) {
      this.emailAddresses.splice(index, 1);
    }
  }
}
