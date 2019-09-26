import { Component, NgZone } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';

import { RestApiService } from './../../rest-api.service';
import { StudentregisterPage } from './../studentregister/studentregister.page';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss']
})
export class StudentPage {
  student_list: any = [];

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = '';
    this._centername = '';
    //console.log('###localStorage: '+JSON.stringify(localStorage));
    this.getallstudents(this._userid);
  }

  async getallstudents(userid){
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallstudentsbyteacher(userid)
      .subscribe(res => {
        console.log(res);
        this.student_list = res;
        loading.dismiss();
      }, err => {
        console.log(err);
        this.student_list = [];
        loading.dismiss();
      });
  }

  async explor(){
    this.navController.navigateForward('/studentexplor');
  }

  async open_register_modal(studentObj, flag){
    /*  studentObj == null <-- new user register
        else               <-- existing user update
    */
    const modal = await this.modalController.create({
      component: StudentregisterPage,
      componentProps: { res: {flag: flag, studentObj: studentObj} } 
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log('@@@Modal Data: '+JSON.stringify(data));
    });
    return await modal.present(); 
  }
}
