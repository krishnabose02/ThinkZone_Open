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
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage {
  public profile_data: any = [];
  userid: string = '';
  username: string = '';
  usertype: string = '';
  gender: string = '';
  dob: string = '';
  regdate: string = '';
  emailid: string = '';
  contactno: string = '';
  address: string = '';
  

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
    console.log('###localStorage: '+JSON.stringify(localStorage));

    this.getUserProfile();
  }

  async getUserProfile(){
    let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.getuserbyuserid(this._userid)
        .subscribe(res => {
          console.log('@@@User profile: '+res);
          this.profile_data = res;
          if(this.profile_data.length > 0){
            this.userid = this.profile_data[0].userid;
            this.username = this.profile_data[0].username;
            this.usertype = this.profile_data[0].usertype;
            this.gender = this.profile_data[0].gender;
            this.dob = this.profile_data[0].dob;
            this.regdate = this.profile_data[0].createdon;
            this.emailid = this.profile_data[0].emailid;
            this.contactno = this.profile_data[0].contactnumber;
            this.address = this.profile_data[0].permanentaddress;
            
          }
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
