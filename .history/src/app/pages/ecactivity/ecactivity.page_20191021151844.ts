import { Component, NgZone } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { RestApiService } from './../../rest-api.service';

@Component({
  selector: 'app-ecactivity',
  templateUrl: './ecactivity.page.html',
  styleUrls: ['./ecactivity.page.scss']
})
export class EcactivityPage {
  program = 'ece';
  subject = 'na';
  month_list: any = [];
  week_list: any = [];
  activity_list: any = [];
  selected_month = '';
  selected_week = '';
  activity_heading = '';

  month_diff: number;
  userobj: any = {};
  userreg_date = '';

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  toolbarshadow = true;
  active_month_list = [];
  loading;
  activity_loaded = false;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private router: Router
  ) {
    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
    this._centerid = '';
    this._centername = '';

    this.getuserbyid(this._userid);
  }

  async getuserbyid(userid) {
    const loading = await this.loadingController.create({spinner: 'dots'});
    await loading.present();
    await this.api.getuserbyuserid(userid).subscribe(res => {
        if (res.length > 0) {
          this.userobj = res[0];
          this.userreg_date = res[0].createdon;
        }
        // console.log('@@@userobj: ' + JSON.stringify(this.userobj));
        // console.log('@@@userreg_date: ' + this.userreg_date);
        this.calculatemonth(new Date(this.userreg_date), new Date());
        // this.calculatemonth(new Date(2018,11,11), new Date(2019,5,7));
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  calculatemonth(fromDate, toDate) {
    // month difference
    let months = (toDate.getMonth() - fromDate.getMonth()) + (12 * (toDate.getFullYear() - fromDate.getFullYear())) + 1;
    if (toDate.getDate() < fromDate.getDate()) {
        months--;
    }
    this.month_diff = months;
    // console.log('@@@month_diff: ' + this.month_diff);

    // make mont_diff a +ve number
    this.month_diff = (this.month_diff < 0) ? (this.month_diff * -1) : this.month_diff;
    let obj = {};
    this.month_list = [];
    for (let i = 1; i <= 12; i++) {
      if ( i <= this.month_diff) {
        obj = { value: '' + i, text: 'Month ' + i, disabled: false};
        this.active_month_list.push({name: 'Month ' + i, value: i, selected: false});
      } else {
        obj = { value: '' + i, text: 'Month ' + i, disabled: true};
      }

      this.month_list.push(obj);
    }
    // console.log('@@@month_list: ' + JSON.stringify(this.month_list));
  }

  // month on change event
  month_onchange(value) {
    this.active_month_list.forEach(element => {
      element.selected = false;
    });
    this.active_month_list[value - 1].selected = true;

    // console.log('@@@selected_month: '+value);
    this.selected_month = value;
    let obj = {};
    this.week_list = [];
    for (let i = 1; i <= 4; i++) {
      obj = { value: '' + i, text: 'Week ' + i};
      this.week_list.push(obj);
    }

    // set activity heading
    // if (this.selected_month.trim().length > 0 && this.selected_week.trim().length > 0) {

    if (this.selected_month !== '' && this.selected_week !== '') {
      this.getactivitydetails(this.selected_month, this.selected_week);
    }
  }

  week_onchange(value) {
    // console.log('@@@selected_week: '+value);
    this.selected_week = value;

    // set activity heading
    // if (this.selected_month.trim().length > 0 && this.selected_week.trim().length > 0) {

    if (this.selected_month !== '' && this.selected_week !== '') {
      this.getactivitydetails(this.selected_month, this.selected_week);
    }
  }

  async reloadActivityData(monthAndWeek: string) {
    const mnw = monthAndWeek.split(' ');
    this.getactivitydetails(mnw[0], mnw[1]);
  }
  async getactivitydetails(month, week) {
    this.selected_month = month;
    this.selected_week = week;
    this.activity_heading = 'Month(' + this.selected_month + ') - Week(' + this.selected_week + ')';

    this.loading = await this.loadingController.create({spinner: 'dots'});
    await this.loading.present();
    let preferedlanguage = localStorage.getItem("_language");
    await this.api.getmasteractivities(preferedlanguage, this.program, this.subject, this.selected_month, this.selected_week).subscribe(res => {
        // loading.dismiss();
        console.log('>>>List of Activities: '+JSON.stringify(res));
        this.setActivityStatus(res);
      }, err => {
        console.log(err);
        this.loading.dismiss();
      });
  }

  async setActivityStatus(all_activities) {
    // const loading = await this.loadingController.create({});
    // await loading.present();
    await this.api.gettchactivitybyuser(
                                        this._userid,
                                        this.program,
                                        this.subject,
                                        this.selected_month,
                                        this.selected_week
                    ).subscribe(res => {
        this.activity_list = [];
        this.activity_loaded = true;
        all_activities.forEach(element => {
          let obj = {};
          if (res.includes(element)) {
            obj = { val: element, cls: 'success' };
          } else {
            obj = { val: element, cls: 'warning' };
          }
          this.activity_list.push(obj);
        });
        this.loading.dismiss();
        console.log('@@@activity_list: ' + JSON.stringify(this.activity_list));
        console.log('@@@all_activities: ' + JSON.stringify(all_activities));
      }, err => {
        console.log(err);
        this.loading.dismiss();
      });
  }

  // ece fillmarks button click
  async activity_btnclick(activity) {
    // navigate forward with params
    const paramiters = {
      program: this.program,
      subject: this.subject,
      month: this.selected_month,
      week: this.selected_week,
      activity: activity
    };
    const navigationExtras: NavigationExtras = {
      queryParams: {
        paramiters: JSON.stringify(paramiters)
      }
    };
    // this.navController.navigateForward('/ecactivity2', navigationExtras);
    this.router.navigate(['ecactivity2'], navigationExtras);
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
