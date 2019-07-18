import { Component, OnInit } from '@angular/core';
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

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public api: RestApiService,
    public modalController: ModalController
  ) {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.loginFormGroup = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  // on logging in
  async onLoggedin() {
      let data = {
        userid: this.loginFormGroup.value.email,
        password: this.loginFormGroup.value.password,
        usertype: 'manager'
      }
      console.log('@@@ data: '+JSON.stringify(data));
      let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.authenticateuser(data)
        .subscribe(res => {
          console.log('###res: '+res);
          loading.dismiss();
          if(res['success'] == 'success'){
            localStorage.setItem('_userid', res['userid']);
            localStorage.setItem('_username', res['username']);
            localStorage.setItem('_emailid', res['emailid']);
            this.navCtrl.navigateRoot('/home-results');
          }            
        }, err => {
          console.log('@@@server error: '+err);
          loading.dismiss();
        });
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Forgot Password?',
      message: 'Enter you email address to send a reset link password.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: async () => {
            const loader = await this.loadingController.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email was sended successfully.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // // //
  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: SigninPage
    });
    return await modal.present();
  }
}
