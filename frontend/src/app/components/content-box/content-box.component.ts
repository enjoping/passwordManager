import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pm-content-box',
  templateUrl: './content-box.component.html',
  styleUrls: [ './content-box.component.scss' ]
})
export class ContentBoxComponent implements OnInit {
  @Input() header = '';

  @Output() click = new EventEmitter();
  @Output() editClick = new EventEmitter();
  @Output() removeClick = new EventEmitter();

  showEdit = false;


  ngOnInit(): void {
    this.showEdit = this.editClick.observers.length > 0;
  }

  removeClicked() {
    this.removeClick.emit();
  }

  editClicked() {
    this.editClick.emit();
  }

  clicked() {
    this.click.emit();
  }
}
