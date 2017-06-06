import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'pm-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: [ './page-header.component.scss' ]
})
export class PageHeaderComponent {
  @Input() header = '';

  @Input() button = '';

  @Input() search = 'Search..';

  @Output() buttonClicked = new EventEmitter();
}
