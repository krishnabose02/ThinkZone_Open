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
import { PgeengassessmentmodalPage } from './../modal/pgeengassessmentmodal/pgeengassessmentmodal.page';
import { PgemathassessmentmodalPage } from './../modal/pgemathassessmentmodal/pgemathassessmentmodal.page';

@Component({
  selector: 'app-ecactivity',
  templateUrl: './ecactivity.page.html',
  styleUrls: ['./ecactivity.page.scss']
})
export class EcactivityPage {
  program: string = 'ece';
  subject: string = 'na';
  month_list: any = [];
  week_list: any = [];
  activity_list: any = [];
  selected_month: string = '';
  selected_week: string = '';
  activity_heading: string ='';

  month_diff: number;
  userobj: any = {};
  userreg_date: string = '';
  
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

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

  async getuserbyid(userid){
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getuserbyuserid(userid).subscribe(res => {
        if (res.length > 0) {
          this.userobj = res[0];
          this.userreg_date = res[0].createdon;
        } 
        //console.log('@@@userobj: ' + JSON.stringify(this.userobj));
        //console.log('@@@userreg_date: ' + this.userreg_date);
        this.calculatemonth(new Date(this.userreg_date), new Date());
        //this.calculatemonth(new Date(2018,11,11), new Date(2019,5,7));
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  calculatemonth(fromDate, toDate){
    // month difference
    let months = (toDate.getMonth() - fromDate.getMonth()) + (12 * (toDate.getFullYear() - fromDate.getFullYear())) + 1;
    if(toDate.getDate() < fromDate.getDate()){
        months--;
    }
    this.month_diff = months;
    //console.log('@@@month_diff: ' + this.month_diff);

    // make mont_diff a +ve number
    this.month_diff = (this.month_diff < 0) ? (this.month_diff * -1) : this.month_diff;
    let obj = {};
    this.month_list = [];
    for (let i = 1; i <= 12; i++) {
      if( i <= this.month_diff){
        obj = { value: ''+i, text: 'Month '+i, disabled: false};
      }else{
        obj = { value: ''+i, text: 'Month '+i, disabled: true};
      }
     
      this.month_list.push(obj);
    }
    //console.log('@@@month_list: ' + JSON.stringify(this.month_list));
  }
  
  // month on change event
  month_onchange(value){
    //console.log('@@@selected_month: '+value);
    this.selected_month = value;
    let obj = {};
    this.week_list = [];
    for (let i = 1; i <= 4; i++) {
      obj = { value: ''+i, text: 'Week '+i};
      this.week_list.push(obj);
    }

    // set activity heading
    if(this.selected_month.trim().length > 0 && this.selected_week.trim().length > 0){
      this.getactivitydetails(this.selected_month,this.selected_week);
    }
  }

  week_onchange(value){
    //console.log('@@@selected_week: '+value);
    this.selected_week = value;

    // set activity heading
    if(this.selected_month.trim().length > 0 && this.selected_week.trim().length > 0){
      this.getactivitydetails(this.selected_month,this.selected_week);
    }
  }

  async getactivitydetails(month, week){
    this.selected_month = month;
    this.selected_week = week;
    this.activity_heading = 'Month('+this.selected_month+') - Week('+this.selected_week+')';

    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getmasteractivities(this.program, this.subject, this.selected_month, this.selected_week).subscribe(res => {
        this.activity_list = res;
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  // ece fillmarks button click
  async activity_btnclick(activity){
    // navigate forward with params
    let navigationExtras: NavigationExtras = {
      queryParams: {
        user: 'Hixxxxx'
      }
      /*queryParams: {
        program: this.program, 
        subject: this.subject, 
        month: this.selected_month, 
        week: this.selected_week, 
        activity: activity
      }*/
  };
  //this.navController.navigateForward('/ecactivity2', navigationExtras);
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
}