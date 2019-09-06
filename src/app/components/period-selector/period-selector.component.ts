import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss']
})
export class PeriodSelectorComponent implements OnInit {

  @Input() month;

  @Output() selected;

  selected_month = '';
  selected_week = '';
  week_list;

  constructor() {
    this.selected = new EventEmitter();
   }

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

    if (this.selected_month !== '' && this.selected_week !== '') {
      // emit an event here
      this.selected.emit(this.selected_month + ' ' + this.selected_week);
    }
  }

  week_onchange(value) {
    this.selected_week = value;

    if (this.selected_month !== '' && this.selected_week !== '') {
      // emit an event here too
      this.selected.emit(this.selected_month + ' ' + this.selected_week);
    }
  }
}
