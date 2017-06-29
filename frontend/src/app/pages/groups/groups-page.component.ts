import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateGroupComponent } from '../../components/groups/create-group/create-group.component';
declare var MyData: any;
@Component({
  selector: 'pm-groups-page',
  templateUrl: './groups-page.component.html'
})
export class GroupsPageComponent {


  constructor(private modalService: NgbModal) {

  }

  openModal() {
    const modalReference = this.modalService.open(CreateGroupComponent);
    console.log(MyData.keyStore.listKeys());
  }
}
