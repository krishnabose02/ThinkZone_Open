import { Component, ViewChild , ViewChildren, QueryList } from '@angular/core';
import { Platform, NavController, IonRouterOutlet, AlertController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { environment } from 'src/environments/environment.prod';
import { RestApiService } from './rest-api.service';

// Transalte
import { TranslateConfigService } from './translate-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedLanguage: string;
  _userid: string;
  _username: string;
  _emailid: string;

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  // @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private fcm: FCM,
    private api: RestApiService,
    private translateConfigService: TranslateConfigService
  ) {
    this.backButtonEvent();
    

    console.log('@@@ inside app component LOCAL STORAGE: ' + JSON.stringify(localStorage));
    // translate get language
    if (localStorage.getItem('_language') == undefined
          || localStorage.getItem('_language') == null
          || localStorage.getItem('_language') == '') {
      //this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
      this.selectedLanguage = 'en';
    } else {
      this.selectedLanguage = localStorage.getItem('_language');
    }
    this.languageChanged(this.selectedLanguage);

    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
    this._emailid = localStorage.getItem('_emailid');
    if (this._userid == null) {
      this.navCtrl.navigateRoot('/login');
    }
    this.initializeApp();
  }

  // translate set language
  languageChanged(value) {
    console.log('@@@ selected language: ' + this.selectedLanguage + '    value: ' + value);
    this.selectedLanguage = value;
    this.translateConfigService.setLanguage(this.selectedLanguage);
    localStorage.setItem('_language', this.selectedLanguage);
  
    this.router.navigate(['/home-results']);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Push notification starts from here
      this.fcm.getToken().then(token => {
        localStorage.setItem('fcm_token', token);
        console.log('@@@ app.component fcm_token' + token);
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        localStorage.setItem('fcm_rtoken', token);
        console.log('@@@ app.component fcm_rtoken' + token);
      });

      this.fcm.onNotification().subscribe(data => {
        console.log('@@@ Push notification data: ' + JSON.stringify(data));
        if (data.wasTapped) {
          console.log('@@@ app.component Received in background');
          this.router.navigate(['/showpushnotification', data.message]);
        } else {
          console.log('@@@ app.component Received in foreground');
          this.router.navigate(['/showpushnotification', data.message]);
        }
      });

    }).catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('edit-profile');
  }

  logout() {
    this.setCheckoutTime();
    localStorage.clear();
    this.navCtrl.navigateRoot('/login');
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else {
        this.setCheckoutTime();
        this.exitTheApp(this.router.url);
      }
    });
  }

  async exitTheApp(url) {
    const alert = await this.alertController.create({
      header: 'Exit',
      subHeader: '',
      message: 'Are you Sure?',
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
          handler: () => {
            console.log('Confirm Okay');
            navigator['app'].exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  async setCheckoutTime() {
    const id = localStorage.getItem('_document_id');
    const time = new Date();
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.setcheckouttime(id, time).subscribe(res => {
        console.log('@@@Checkout: ' + res.status);
        localStorage.removeItem('_document_id');
        loading.dismiss();
      }, err => {
        localStorage.removeItem('_document_id');
        console.log(err);
        loading.dismiss();
      });
  }
}
