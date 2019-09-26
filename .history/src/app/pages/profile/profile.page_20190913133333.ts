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
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage {
  public onRegisterForm: FormGroup;
  class_list: any = [];
  profile_name: string = '';
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
    //private sanitizer: DomSanitizer,
    private loadingController: LoadingController
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = '';
    this._centername = '';
    console.log('###localStorage: '+JSON.stringify(localStorage));

    this.getUserProfile();
  }

  async getUserProfile(){
    let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.getuserbyuserid(this._userid)
        .subscribe(res => {
          console.log('@@@User profile: '+res);
          loading.dismiss();
          //this.showAlert('Profile Registration', '', 'Profile registration '+res['status']+' !!!');
          //this.navController.navigateBack('/home-results');
        }, err => {
          console.log(err);
          loading.dismiss();
          this.showAlert('Profile Error', '', 'Unable to fetch user profile by this time !!!');
        });
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
