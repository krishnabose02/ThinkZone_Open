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

  baseline_q: any = [];
  subject: string = '';
  lvl: string = '';

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
    this._id = this.res._id;
    this.program = this.res.program;
    this.class = this.res.class;
    this.level = this.res.level;

    this.subject = this.navParams.data.subject;
    console.table('@#@#subject: '+JSON.stringify(this.subject));
    this.lvl = this.navParams.data.level;
    console.table('@#@#level: '+JSON.stringify(this.level));
    this.getData();
  }

  closeModal() {
    this.modalController.dismiss({data: 'Ok'});
  }

  async getData() {
    const data = {
      program: this.program,
      class: this.class,
      subject: this.subject,
      level: this.lvl
    };
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getbaselinetestquestionset(data)
      .subscribe(res => {
        console.log('@@@Baseline from db: '+JSON.stringify(res));
        loading.dismiss();
        this.baseline_q = res;
        //this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');         
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }
}
