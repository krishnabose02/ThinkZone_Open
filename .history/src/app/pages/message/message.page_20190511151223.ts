import { Component, OnInit } from '@angular/core';
import {
    NavController,
    AlertController,
    MenuController,
    ToastController,
    PopoverController,
    LoadingController,
    ModalController } from '@ionic/angular';

import { RestApiService } from './../../rest-api.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

  userid: string=localStorage.getItem("_userid");
  respons: any;

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              public popoverCtrl: PopoverController,
              public alertController: AlertController,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              public api: RestApiService,
              private loadingController: LoadingController) { }

    ngOnInit() {
        this.getResponse();
    }

    async getResponse() {
        let loading = await this.loadingController.create({});
        await loading.present();
        await this.api.getmessagesbyuserid(this.userid)
            .subscribe(res => {
                console.log('@@@Feedback from db: '+JSON.stringify(res));
                loading.dismiss();
                this.respons = res;
                //this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');
            }, err => {
                console.log(err);
                loading.dismiss();
            });
    }

}
