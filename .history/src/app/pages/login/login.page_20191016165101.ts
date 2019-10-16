import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { RestApiService } from './../../rest-api.service';
import { SigninPage } from './../modal/signin/signin.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginFormGroup: FormGroup;
  public loginState = 0;
  public signinFormGroup: FormGroup;
  _status = true;
  _message = '';
  fcm_token: string = localStorage.getItem('fcm_token');
  fcm_rtoken: string = localStorage.getItem('fcm_rtoken');

  errormessage: string = '';

  @Input() value: any;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public api: RestApiService,
    public modalController: ModalController
  ) {
    this.signinFormGroup = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.errormessage = '';
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  // ngOnInit() {
  //   this.loginFormGroup = this.formBuilder.group({
  //     'email': [null, Validators.compose([
  //       Validators.required
  //     ])],
  //     'password': [null, Validators.compose([
  //       Validators.required
  //     ])]
  //   });
  // }

  // on logging in
  // async onLoggedin() {
  //     const data = {
  //       userid: this.loginFormGroup.value.email,
  //       password: this.loginFormGroup.value.password,
  //       usertype: 'manager'
  //     };
  //     console.log('@@@ data: ' + JSON.stringify(data));
  //     const loading = await this.loadingController.create({});
  //     await loading.present();
  //     await this.api.authenticateuser(data)
  //       .subscribe(res => {
  //         console.log('###res: ' + res);
  //         loading.dismiss();
  //         if ( res['success'] === 'success' ) {
  //           localStorage.setItem('_userid', res['userid']);
  //           localStorage.setItem('_username', res['username']);
  //           localStorage.setItem('_emailid', res['emailid']);
  //           this.navController.navigateRoot('/home-results');
  //         }
  //       }, err => {
  //         console.log('@@@server error: ' + err);
  //         loading.dismiss();
  //       });
  // }

  // async forgotPass() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Forgot Password?',
  //     message: 'Enter you email address to send a reset link password.',
  //     inputs: [
  //       {
  //         name: 'email',
  //         type: 'email',
  //         placeholder: 'Email'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           console.log('Confirm Cancel');
  //         }
  //       }, {
  //         text: 'Confirm',
  //         handler: async () => {
  //           const loader = await this.loadingController.create({
  //             duration: 2000
  //           });

  //           loader.present();
  //           loader.onWillDismiss().then(async l => {
  //             const toast = await this.toastCtrl.create({
  //               showCloseButton: true,
  //               message: 'Email was sended successfully.',
  //               duration: 3000,
  //               position: 'bottom'
  //             });

  //             toast.present();
  //           });
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

  // // //
  // goToRegister() {
  //   this.navController.navigateForward('/register');
  // }

  // async openModal() {
  //   const modal = await this.modalController.create({
  //     component: SigninPage
  //   });
  //   return await modal.present();
  // }

  goToNextPage() {
    if (this.loginState === 0) {
      this.loginState = 1;
      return;
    }
    this.signin();
  }

  // The Code below has been copied from SigninPage modal

  ngOnInit() {
    this.signinFormGroup = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
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
    await this.api.authenticateuser(data).subscribe(res => {
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