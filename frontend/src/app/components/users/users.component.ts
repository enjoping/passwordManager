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

  constructor(private userRepository: UserRepositoryService) {


  }

  ngOnInit(): void {
    this.users = this.userRepository.all();
  }

  remove(user: User) {
    this.userRepository.deleteModel(user);
  }

  edit(val) {
    this.editUserId = val;
  }

  update(user: User) {
    console.log(user.username + ' ' + user.email);
    this.userRepository.saveModel(user);
  }
}
