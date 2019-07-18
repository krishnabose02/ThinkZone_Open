import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController, LoadingController, AlertController, NavParams } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { RestApiService } from './../../../rest-api.service';

@Component({
  selector: 'app-messagebody',
  templateUrl: './messagebody.page.html',
  styleUrls: ['./messagebody.page.scss'],
})
export class MessagebodyPage implements OnInit {
  res: any;
  message_title: string = '';
  message_body: string = '';

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
    //console.table('@#@#res: '+JSON.stringify(this.navParams.data.res));
    this.message_title = this.res['title'];
    this.message_body = this.res['message'];
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
