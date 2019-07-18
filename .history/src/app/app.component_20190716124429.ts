import { Component, ViewChild , ViewChildren, QueryList } from '@angular/core';
import { Platform, NavController, IonRouterOutlet, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Pages } from './interfaces/pages';
import { FCM } from '@ionic-native/fcm/ngx';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public appPages: Array<Pages>;
  _userid: string;
  _username: string;
  _emailid: string;

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  //@ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private alertController: AlertController,
    private router: Router,
    private fcm: FCM
  ) {
    this.backButtonEvent();
    this.appPages = [
      /*{
        title: 'Home',
        url: '/home-results',
        direct: 'root',
        icon: 'home'
      },*/
      {
        title: 'Student Details',
        url: '/student',
        direct: 'forward',
        icon: 'contact'
      },
      {
        title: 'Attendance',
        url: '/attendance',
        direct: 'forward',
        icon: 'paper'
      },
      {
        title: 'Payment',
        url: '/tchpayment',
        direct: 'forward',
        icon: 'cash'
      },
      {
        title: 'Activities(ECE)',
        url: '/ecactivity',
        direct: 'forward',
        icon: 'stats'
      },
      {
        title: 'Assessment(ECE)',
        url: '/ecassessment',
        direct: 'forward',
        icon: 'swap'
      },
      {
        title: 'Maths Activities(PGE)',
        url: '/pgactivity',
        direct: 'forward',
        icon: 'stats'
      },
      {
        title: 'Eng. Activities(PGE)',
        url: '/pgactivity',
        direct: 'forward',
        icon: 'stats'
      },
      {
        title: 'Assessment(PGE)',
        url: '/pgassessment',
        direct: 'forward',
        icon: 'swap'
      },
      {
        title: 'Teacher Training',
        url: '/message',
        direct: 'forward',
        icon: 'school'
      },
      {
        title: 'Messages',
        url: '/message',
        direct: 'forward',
        icon: 'mail-unread'
      },
      {
        title: 'About',
        url: '/about',
        direct: 'forward',
        icon: 'at'
      }
      
      /*,
      {
        title: 'App Settings',
        url: '/settings',
        direct: 'forward',
        icon: 'cog'
      }*/
    ];

    this.initializeApp();
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._emailid = localStorage.getItem("_emailid");
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Push notification starts from here
      this.fcm.getToken().then(token => {
        localStorage.setItem('fcm_token',token);
        console.log('@@@ app.component fcm_token'+token);
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        localStorage.setItem('fcm_rtoken',token);
        console.log('@@@ app.component fcm_rtoken'+token);
      });

      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        if (data.wasTapped) {
          console.log('@@@ app.component Received in background');
          this.router.navigate([data.landing_page, data.price]);
        } else {
          console.log('@@@ app.component Received in foreground');
          this.router.navigate([data.landing_page, data.price]);
        }
      });
      
    }).catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('edit-profile');
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot('/');
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      }/*else if (this.router.url === '/center') {
        this.navCtrl.navigateRoot('/home-results');
      }*/ else {
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
}