import { Component, NgZone } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';
import { AttendancemodalPage } from './../modal/attendancemodal/attendancemodal.page';
import { HolidaymodalPage } from './../modal/holidaymodal/holidaymodal.page';
import { RestApiService } from './../../rest-api.service';

@Component({
  selector: 'app-ecassessment',
  templateUrl: './ecassessment.page.html',
  styleUrls: ['./ecassessment.page.scss']
})
export class EcassessmentPage {
  selected_quarter: string = '';
  month_diff: number;
  userobj: any = {};
  userreg_date: string = '';

  attendance_list: any = [];
  attendance_date: string = new Date().toISOString();
  attendance_day: string = '';
  max_date: string = '';
  min_date: string = '';
  is_attendance_taken: boolean = false;

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
    private loadingController: LoadingController
  ) {
    // set min date and max date for the calendar
    const dt = new Date(this.attendance_date);

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
        console.log('@@@userobj: ' + JSON.stringify(this.userobj));
        console.log('@@@userreg_date: ' + this.userreg_date);
        //this.calculateQuarter(new Date(this.userreg_date), new Date());
        this.calculateQuarter(new Date(2019,5,7), new Date(2018,11,11));
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }
  
  

  // quarter on change event
  quarter_onchange(value){
    console.log('@@@Attendance: '+value);
    this.selected_quarter = value;
  }

  calculateQuarter(fromDate, toDate){
    let months = (toDate.getMonth() - fromDate.getMonth()) + (12 * (toDate.getFullYear() - fromDate.getFullYear())) + 1;
    if(toDate.getDate() < fromDate.getDate()){
        months--;
    }
    this.month_diff = months;
    console.log('@@@month_diff: ' + this.month_diff);
  }

  // set holiday button click
  async setholiday_onclick(){
    const modal = await this.modalController.create({
      component: HolidaymodalPage,
      componentProps: { res: {userid: this._userid, username: this._username, date: this.attendance_date, day: this.attendance_day} } 
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log('@@@Modal Data: '+JSON.stringify(data));
        //this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
    });
    return await modal.present();
  }

  // take attendance button click
  async takeattendance_onclick(){
    const modal = await this.modalController.create({
      component: AttendancemodalPage,
      componentProps: { res: {userid: this._userid, username: this._username, date: this.attendance_date, day: this.attendance_day} } 
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log('@@@Modal Data: '+JSON.stringify(data));
        //this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
    });
    return await modal.present();
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