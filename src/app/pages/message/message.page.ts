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
import { MessagebodyPage } from './../modal/messagebody/messagebody.page';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
    isUnread = false;

  userid: string = localStorage.getItem('_userid');
  respons: any;
  toolbarshadow = true;

  constructor(public navCtrl: NavController,
              public menuCtrl: MenuController,
              public popoverCtrl: PopoverController,
              public alertController: AlertController,
              public modalController: ModalController,
              public toastCtrl: ToastController,
              public api: RestApiService,
              private loadingController: LoadingController) { }

    ngOnInit() {
        this.getResponse();
    }

    async getResponse() {
        const loading = await this.loadingController.create({});
        await loading.present();
        await this.api.getmessagesbyuserid(this.userid)
            .subscribe(res => {
                // console.log('@@@Feedback from db: '+JSON.stringify(res));
                loading.dismiss();
                this.respons = res;
                // this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');
            }, err => {
                console.log(err);
                loading.dismiss();
            });
    }

    async openMessage(res) {
        // console.log('#$#$res: '+JSON.stringify(res))
        const modal = await this.modalController.create({
            component: MessagebodyPage,
            componentProps: {res: res} // <-- this is used to pass data from  this page to the modal page that will open on click
        });
        this.updateMessageStatus(res);
        return await modal.present();
    }
    async updateMessageStatus(res) {
        if (res['status'] === 'unread') {
            const _id = res['_id'];
            const id = res['id'];
            const userid = res['userid'];
            const title = res['title'];
            const message = res['message'];
            const status = 'read';
            const readon = new Date;

            const body = {
                id: id,
                userid: userid,
                title: title,
                message: message,
                status: status,
                readon: readon
            };

            const loading = await this.loadingController.create({});
            await loading.present();
            await this.api.updatemessagebyid(_id, body)
                .subscribe(res => {
                    // console.log('@@@Feedback from db: '+JSON.stringify(res));
                    loading.dismiss();
                    // this.getResponse();
                }, err => {
                    console.log(err);
                    loading.dismiss();
                });
                this.getResponse();
        }
    }
    logScrolling(event) {
        // console.log(event);
        if (event.detail.currentY === 0) {
            console.log('top');
            this.toolbarshadow = true;
        } else {
            this.toolbarshadow = false;
        }
    }
}
