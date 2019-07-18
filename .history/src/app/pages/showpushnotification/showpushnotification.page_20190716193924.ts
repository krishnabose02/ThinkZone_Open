import { Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-showpushnotification',
  templateUrl: './showpushnotification.page.html',
  styleUrls: ['./showpushnotification.page.scss']
})
export class ShowpushnotificationPage {
   _userid: string;
  _username: string;

  message: any = '';
  constructor(
    private route: ActivatedRoute
  ) {
    this.message = this.route.snapshot.params['message'];
    console.log('#### 1: '+this.message)
    this.route.params.subscribe( params => console.log('#### 2: '+params) );

    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
  }
}