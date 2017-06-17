
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
import Member from '../../../models/member.model';
import {MemberRepositoryService} from '../../../services/repositories/member-repository.service';


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
              private memberRepository: MemberRepositoryService,
              private loginService: LoginService) {

    this.group = this.groupRepository.createModel();
    this.group.user = this.loginService.currentUser;
  }


  search = (text: Observable<String>) => {
    return text
      .debounceTime(200)
      .distinctUntilChanged()
      .map((term) => {
        if (term.length < 2) {
          return [ ];
        }

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
      // Create a new member from the user. The password will be set by the server.
      const member = this.memberRepository.createModel();
      member.jsonFill({ user: user._id, password: 'random-password' });
      this.group.members.push(member);

      // Reset the email input.
      emailInput.value = '';
    }
  }

  removeUser(email): void {
    const index = this.group.members.findIndex((v => v.user.email === email));
    if (index > -1) {
      this.group.members.splice(index, 1);
    }
  }

  createGroup(): void {
    this.groupRepository.saveModel(this.group)
      .then((group) => {
        const promises = [ ];
        this.group.members.forEach((member) => {
          promises.push(this.memberRepository.saveModel(member));
        });
        return Promise.all(promises);
      })
      .then(() => {
        this.activeModal.dismiss('success');
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
