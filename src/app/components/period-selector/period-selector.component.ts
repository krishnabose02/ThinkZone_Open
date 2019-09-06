import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss']
})
export class PeriodSelectorComponent implements OnInit {

  @Input() month;

  @Output() selected = new EventEmitter();

  selected_month = '';
  selected_week = '';
  week_list;

  constructor() { }

  ngOnInit() {
  }

  month_onchange(value) {
    this.month.forEach(element => {
      element.selected = false;
    });
    this.month[value - 1].selected = true;

    // console.log('@@@selected_month: '+value);
    this.selected_month = value;
    let obj = {};
    this.week_list = [];
    for (let i = 1; i <= 4; i++) {
      obj = { value: '' + i, text: 'Week ' + i};
      this.week_list.push(obj);
    }

    // set activity heading
    // if (this.selected_month.trim().length > 0 && this.selected_week.trim().length > 0) {

    if (this.selected_month !== '' && this.selected_week !== '') {
      // this.getactivitydetails(this.selected_month, this.selected_week);
      // emit an event here
    }
  }
}
