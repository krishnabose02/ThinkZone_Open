import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController, LoadingController, AlertController, NavParams } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { RestApiService } from './../../../rest-api.service';

@Component({
  selector: 'app-baseline',
  templateUrl: './baseline.page.html',
  styleUrls: ['./baseline.page.scss'],
})
export class BaselinePage implements OnInit {
  res: any;
  _id: string = '';
  userid: string = '';
  username: string = '';
  centerid: string = '';
  centername: string = '';
  studentid: string = '';
  studentname: string = '';
  program: string = '';
  class: string = '';
  phone: string = '';
  gender: string = '';
  dob: string = '';
  parentsname: string = '';
  level: string = '';
  createdon: string = '';

  @Input() value: any;
  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public api: RestApiService,
    public navParams: NavParams
  ) {}

  ngOnInit() {
    this.res = this.navParams.data.res;
    console.table('@#@#res: '+JSON.stringify(this.res));
  }

  closeModal() {
    this.modalController.dismiss({data: 'Ok'});
  }
}
