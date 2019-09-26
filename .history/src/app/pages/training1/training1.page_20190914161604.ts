import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public onRegisterForm: FormGroup;
  class_list: any = [];
  training1_name: string = '';
  program: string = '';
  class: string = '';
  phone: number = 0;
  gender: string = '';
  dob: string = '';
  father: string = '';
  regdate: string = '';

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  hide_class_field: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
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
  }

  async getAllModules(){
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltrainingmodules()
      .subscribe(res => {
        console.log(res);
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
        this.showAlert('Teacher training', '', 'Unable to fetch modules at this time !!!');
      });
  }

  select_program_onchange(value){
    console.log('@@@Selected program: ', value);
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
