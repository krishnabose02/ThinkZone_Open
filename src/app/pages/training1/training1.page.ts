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
import { Training2Page } from '../training2/training2.page';


@Component({
  selector: 'app-training1',
  templateUrl: './training1.page.html',
  styleUrls: ['./training1.page.scss']
})
export class Training1Page {
  public allmodule_list: any = [];
  public allmodule_name: any[];
  public allsubmodule_list: any = [];
  toolbarshadow = true;
  init_module = '';


  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  hide_class_field = false;

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
    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
    this._centerid = '';
    this._centername = '';
    this.getAllModules();
  }

  async getAllModules() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltrainingmodules()
      .subscribe(res => {
        console.log('@@@Module list: ' + JSON.stringify(res));
        this.allmodule_list = res;
        loading.dismiss();

        // load on page load time
        this.allmodule_name = [];
        if (this.allmodule_list.length > 0) {
          this.init_module = this.allmodule_list[0].moduleid;
          this.getAllSubmodules(this.init_module);
          let count = true;
          this.allmodule_list.forEach(element => {
            element.selected = count;
            element.progress = Math.random() * 100;
            count = false;
            this.allmodule_name.push(element);
          });
          console.log(this.allmodule_name);
        }
      }, err => {
        console.log(err);
        loading.dismiss();
        this.showAlert('Teacher training', '', 'Unable to fetch modules at this time !!!');
      });
  }

  reloadData($event) {
    console.log(event);
  }
  async getAllSubmodules(moduleid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltrainingsubmodules(moduleid)
      .subscribe(res => {
        console.log('@@@Module list: ' + JSON.stringify(res));
        this.allsubmodule_list = res;
        this.allsubmodule_list.forEach(element => {
          element.progress = Math.random() * 100; // change this to original value
        });
        console.log(this.allsubmodule_list);
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
        this.showAlert('Teacher training', '', 'Unable to fetch modules at this time !!!');
      });
  }

  module_select_onchange(value) {
    this.allmodule_name.forEach(element => {
      element.selected = false;
    });
    value.selected = true;
    console.log('@@@Selected Module: ', value.moduleid);
    this.getAllSubmodules(value.moduleid);
  }

  async submodule_click(submodule) {
    console.log('@@@Selected Submodule: ', JSON.stringify(submodule));

      // call eng assessment modal
      const modal = await this.modalController.create({
        component: Training2Page,
        componentProps: { res: {submodule: submodule} }
      });
      modal.onDidDismiss()
        .then((data) => {
          console.log('@@@Modal Data: ' + JSON.stringify(data));
          // this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
      });
      return await modal.present();
  }

  async explor() {
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
