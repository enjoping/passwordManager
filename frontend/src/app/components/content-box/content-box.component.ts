import {Component, Input} from '@angular/core';

@Component({
  selector: 'pm-content-box',
  templateUrl: './content-box.component.html',
  styleUrls: [ './content-box.component.scss' ]
})
export class ContentBoxComponent {
  @Input() header = '';
}
