import { Component } from '@angular/core';
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
  selector: 'app-training1',
  templateUrl: './training1.page.html',
  styleUrls: ['./training1.page.scss']
})
export class Training1Page {
  public allmodule_list: any = [];
  public allsubmodule_list: any = [];

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  hide_class_field: boolean = false;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = '';
    this._centername = '';
    this.getAllModules();
  }

  async getAllModules(){
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltrainingmodules()
      .subscribe(res => {
        console.log('@@@Module list: '+JSON.stringify(res));
        this.allmodule_list = res;
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
        this.showAlert('Teacher training', '', 'Unable to fetch modules at this time !!!');
      });
  }

  async getAllSubmodules(moduleid){
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltrainingsubmodules(moduleid)
      .subscribe(res => {
        console.log('@@@Module list: '+JSON.stringify(res));
        this.allsubmodule_list = res;
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
        this.showAlert('Teacher training', '', 'Unable to fetch modules at this time !!!');
      });
  }

  module_select_onchange(value){
    console.log('@@@Selected Module: ', value);
    this.getAllSubmodules(value);
  }

  submodule_click(submodule){
    console.log('@@@Selected Submodule: ', JSON.stringify(submodule));
    /*
      // call eng assessment modal
      const modal = await this.modalController.create({
        component: training2,
        componentProps: { res: {userid: this._userid, username: this._username, studentid: slist.studentid, studentname: slist.studentname, program: slist.program, class: slist.class, stage: this.selected_month} } 
      });
      modal.onDidDismiss()
        .then((data) => {
          console.log('@@@Modal Data: '+JSON.stringify(data));
          //this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
      });
      return await modal.present(); 
    */
  }

  async explor(){
    this.navController.navigateForward('/profile');
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
  // confirm box
  async showConfirm(header: string, subHeader: string, message: string, body: any) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }
}
