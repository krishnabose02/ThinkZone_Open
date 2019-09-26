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

  async openModal() {
    const modal = await this.modalController.create({
      component: SigninPage
    });
    return await modal.present();
  }
}
