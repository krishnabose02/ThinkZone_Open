import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-activity-selector',
  templateUrl: './activity-selector.component.html',
  styleUrls: ['./activity-selector.component.scss']
})
export class ActivitySelectorComponent implements OnInit {

  @Input() heading;
  @Input() activity_list;
  @Output() selected = new EventEmitter();
  constructor() {}

  ngOnInit() {
  }

  activity_btnclick(val) {
    this.selected.emit(val);
  }
}
