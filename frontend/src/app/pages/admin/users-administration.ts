import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateUserComponent} from '../../components/users/create-user/create-user.component';

@Component({
  selector: 'pm-users-administration',
  templateUrl: './users-administration.html',
})
export class UsersAdministrationComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  openModal() {
    const modalReference = this.modalService.open(CreateUserComponent);
  }

  ngOnInit() {
  }

}
