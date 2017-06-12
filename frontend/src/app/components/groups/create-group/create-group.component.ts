
import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {UserRepositoryService} from '../../../services/repositories/user-repository.service';
import Group from '../../../models/group.model';
import {GroupRepositoryService} from '../../../services/repositories/group-repository.service';
import {LoginService} from '../../../services/login.service';


@Component({
  selector: 'pm-create-group-modal',
  templateUrl: './create-group.component.html',
  styleUrls: [ './create-group.component.scss' ]
})
export class CreateGroupComponent {
  group: Group;

  constructor(public activeModal: NgbActiveModal,
              private userRepository: UserRepositoryService,
              private groupRepository: GroupRepositoryService,
              private loginService: LoginService) {

    this.group = this.groupRepository.createModel();
    this.group.owner = this.loginService.currentUser._id;
  }


  search = (text: Observable<String>) => {
    return text
      .debounceTime(200)
      .distinctUntilChanged()
      .map((term) => {
        if (term.length < 2) {
          return [ ];
        }

        console.log(this.userRepository.models);

        return this.userRepository.models.filter(v => v.email.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .map(model => model.email);
      });
  }

  addNewUser(emailInput) {
    const email = emailInput.value;

    const user = this.userRepository
      .models.find((model => model.email === email));

    if (!user) {
      // There is no user with this email.

    } else {
      this.group.users.push(user);
      emailInput.value = '';
    }
  }

  removeUser(email): void {
    const index = this.group.users.findIndex((v => v.email === email));
    if (index > -1) {
      this.group.users.splice(index, 1);
    }
  }

  createGroup(): void {
    console.log('create group', this.group);

    this.groupRepository.saveModel(this.group)
      .then((group) => {
        console.log('group created', group);
      });
  }
}
