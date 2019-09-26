import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ToastController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { RestApiService } from './../../rest-api.service';
import { SigninPage } from './../modal/signin/signin.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isAlreadyLoggedIn: boolean = false;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public api: RestApiService,
    public modalController: ModalController
  ) {
    this.checkLoginStatus();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    console.log('@@@isAlreadyLoggedIn : '+this.isAlreadyLoggedIn);
    if(this.isAlreadyLoggedIn)
      this.navController.navigateRoot('/home-results');
  }

  checkLoginStatus(){
    if(localStorage.getItem('_userid') != undefined && localStorage.getItem('_userid') != null && localStorage.getItem('_userid') != '')
      this.isAlreadyLoggedIn = true;
    else
      this.isAlreadyLoggedIn = false;
  }


  async signin() {
    this._status = true;
    const data = {
      userid: this.signinFormGroup.value.email,
      password: this.signinFormGroup.value.password,
      usertype: 'teacher'
    };
    console.log('@@@ data: ' + JSON.stringify(data));
    const loading = await this.loadingController.create({spinner: 'dots'});
    await loading.present();
    await this.api.authenticateuser(data)
      .subscribe(res => {
        console.log('###res: ' + res);
        loading.dismiss();
        if (res['success'] === 'success') {
          this._status = true;
          this._message = '';

          const uid = res['userid'];
          const uname = res['username'];
          localStorage.setItem('_userid', res['userid']);
          localStorage.setItem('_username', res['username']);
          localStorage.setItem('_emailid', res['emailid']);

          // save token id -----------------------------------
          console.log('@@@ signin page token: ' + this.fcm_token + '    rtoken: ' + this.fcm_rtoken);
          this.api.getfcmtokenidbyuserid(uid)
          .subscribe(res1 => {
            console.log('###token list: ' + JSON.stringify(res1));
            console.log('###token list type: ' + typeof(res1));
            console.log('###token list length: ' + res1.length);
            if (res1.length > 0) {
              const tid = res1[0]['_id'];
              const obj = {
                userid: uid,
                username: uname,
                token: this.fcm_token,
                refresh_token: this.fcm_rtoken
              };
              this.api.updatefcmtokenid(tid, obj).subscribe(res2 => {
                console.log('###token update: ' + res2);
              });
            } else {
              const obj = {
                userid: uid,
                username: uname,
                token: this.fcm_token,
                refresh_token: this.fcm_rtoken
              };
              this.api.createnewfcmtokenid(obj).subscribe(res3 => {
                console.log('###token save: ' + res3);
              });
            }
          }, err => {
            this._status = false;
              this._message = 'Connection error !!!';
            console.log('###error: ' + err);
            loading.dismiss();
          });
          // -------------------------------------------------

          this.navController.navigateRoot('/');
          // this.closeModal();
        } else {
          this._status = false;
          this._message = 'Invalid credentials !!!';
        }
      }, err => {
        this._status = false;
          this._message = 'Connection error !!!';
        console.log('###error: ' + err);
        loading.dismiss();
      });
  }
}
