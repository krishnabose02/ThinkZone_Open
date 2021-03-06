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
  selector: 'app-userfeedback',
  templateUrl: './userfeedback.page.html',
  styleUrls: ['./userfeedback.page.scss'],
})
export class UserfeedbackPage implements OnInit {
    _userid: string = localStorage.getItem('_userid');
    _username: string = localStorage.getItem('_username');
  
    respons: any;

    selected_feedback_or_issue: string = '';
    descrption: string = '';

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
        /*let loading = await this.loadingController.create({});
        await loading.present();
        await this.api.getuserfeedbacksbyuserid(this.userid)
            .subscribe(res => {
                //console.log('@@@Feedback from db: '+JSON.stringify(res));
                loading.dismiss();
                this.respons = res;
                //this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');
            }, err => {
                console.log(err);
                loading.dismiss();
            });*/
    }

    select_feedback_onchange(value){
        console.log('@@@selected_feedback_or_issue: '+value);
        this.selected_feedback_or_issue = value;
    }

    async saveUserfeedback(res){
        console.log('@@@descrition: '+this.descrption);
        /*if(res['status'] == 'unread'){
            let _id = res['_id'];
            let id = res['id'];
            let userid = res['userid'];
            let title = res['title'];
            let userfeedback = res['userfeedback'];
            let status = 'read';
            let readon = new Date;

            const body = {
                id: id,
                userid: userid,
                title: title,
                userfeedback: userfeedback,
                status: status,
                readon: readon
            };
            
            let loading = await this.loadingController.create({});
            await loading.present();
            await this.api.updateuserfeedbackbyid(_id, body)
                .subscribe(res => {
                    //console.log('@@@Feedback from db: '+JSON.stringify(res));
                    loading.dismiss();
                    //this.getResponse();
                }, err => {
                    console.log(err);
                    loading.dismiss();
                });
                this.getResponse();
        }*/
    }
}
