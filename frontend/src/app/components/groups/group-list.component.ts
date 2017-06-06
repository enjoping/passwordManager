import {Component, Input, OnInit} from '@angular/core';
import Group from '../../models/group.model';

@Component({
  selector: 'pm-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: [ './group-list.component.scss' ]
})
export class GroupListComponent implements OnInit {

  @Input() groups = [ ];


  ngOnInit(): void {
    this.groups = [
      new Group({ name: 'Team Marketing' }),
      new Group({ name: 'Team Social Media' }),
      new Group({ name: 'Team Analytics' })
    ];
  }
}
