import { Component, OnInit } from '@angular/core';
import {UserRepositoryService} from '../../services/repositories/user-repository.service';
import User from '../../models/user.model';

@Component({
  selector: 'pm-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: Promise<User[]>;
  editUserId: any;
  editUserName: any;
  editUserMail: any;
  detailView: any;

  constructor(private userRepository: UserRepositoryService) {

  }

  ngOnInit(): void {
    this.users = this.userRepository.all();
    this.editUserId = -1;
    this.editUserName = '';
    this.editUserMail = '';
    this.detailView = false;
  }

  remove(user: User) {
    this.userRepository.deleteModel(user);
  }

  edit(user: User) {
    if (user) {
      this.editUserId = user._id;
      this.editUserName = user.username;
      this.editUserMail = user.email;
    } else {
      this.editUserId = -1;
      this.editUserName = '';
      this.editUserMail = '';
    }
  }

  update(user: User) {
    console.log(user.username + ' ' + user.email);
    this.userRepository.saveModel(user);
  }

  toggleDetail(any) {
    this.detailView = any;
  }
}
