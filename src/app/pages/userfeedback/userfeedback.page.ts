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
    toolbarshadow = true;
    _userid: string = localStorage.getItem('_userid');
    _username: string = localStorage.getItem('_username');

    selected_feedback_or_issue = '';
    descrption = '';

    constructor(public navCtrl: NavController,
        public menuCtrl: MenuController,
        public popoverCtrl: PopoverController,
        public alertController: AlertController,
        public modalController: ModalController,
        public toastCtrl: ToastController,
        public api: RestApiService,
        private loadingController: LoadingController) {}

    ngOnInit() {}

    select_feedback_onchange(value) {
        console.log('@@@selected_feedback_or_issue: ' + value);
        this.selected_feedback_or_issue = value;
    }

    async saveUserfeedback() {
        console.log('@@@descrition: ' + this.descrption);
        if ( this.selected_feedback_or_issue === undefined
            || this.selected_feedback_or_issue == null
            || this.selected_feedback_or_issue === '') {
            this.showAlert('Verify', '', 'Plese select any from Feedback or Issues option !!!');
        } else if ( this.descrption === undefined
            || this.descrption == null
            || this.descrption === '') {
            this.showAlert('Verify', '', 'Plese enter description for Feedback or Issues !!!');
        } else {
            const body = {
                userid: this._userid,
                username: this._username,
                type: this.selected_feedback_or_issue,
                description: this.descrption,
                status: 'NO_ACTION'
            };

            const loading = await this.loadingController.create({});
            await loading.present();
            await this.api.createnewuserfeedback(body)
                .subscribe(res => {
                    loading.dismiss();
                    this.showAlert('Send Feedback', '', 'Sending feedback or Issue ' + res['status']);
                    this.selected_feedback_or_issue = '';
                    this.descrption = '';
                }, err => {
                    console.log(err);
                    loading.dismiss();
                });
        }
    }

    // alert box
    async showAlert(header: string, subHeader: string, message: string) {
        const alert = await this.alertController.create({
        header: header,
        subHeader: subHeader,
        message: message,
        buttons: ['OK']
        });
        await alert.present();
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
