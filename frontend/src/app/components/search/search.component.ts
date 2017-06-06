import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'pm-search',
  templateUrl: './search.component.html',
  styleUrls: [ './search.component.scss' ]
})
export class SearchComponent {

  @Input() label = '';

  @Output() searchQuery = new EventEmitter();

  queryString = '';


  updateQueryString(value) {
    this.queryString = value;
    this.searchQuery.emit(this.queryString);
  }
}
