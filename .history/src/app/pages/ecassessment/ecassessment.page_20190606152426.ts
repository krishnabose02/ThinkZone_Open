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

    this.get_attendance_by_teacher_by_date(this._userid, dt)
    this.set_max_mindate(dt.toISOString());
  }

  async get_attendance_by_teacher_by_date(userid, date){
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getattendanceofteacherbydate(userid, date).subscribe(res => {
        if (res.length > 0) {
          this.is_attendance_taken = true;
        } else {
          this.is_attendance_taken = false;
        }
        console.log('@@@Attendance taken: ' + this.is_attendance_taken);
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }
  
  // set max & min date
  set_max_mindate(dat){
    const dt = new Date(dat);
    dt.setDate(dt.getDate() - 7);
    console.log(dt.toString());
    this.min_date = dt.toISOString();
    this.max_date = new Date().toISOString();

    // get day name
    const dy = dt.getDay();
    if (dy === 0) {
      this.attendance_day = 'Sunday';
    } else if (dy === 1) {
      this.attendance_day = 'Monday';
    } else if (dy === 2) {
      this.attendance_day = 'Tuesday';
    } else if (dy === 3) {
      this.attendance_day = 'Wednesday';
    } else if (dy === 4) {
      this.attendance_day = 'Thursday';
    } else if (dy === 5) {
      this.attendance_day = 'Friday';
    } else if (dy === 6) {
      this.attendance_day = 'Saturday';
    }
  }

  // date on change event
  attendancedate_onhange(value){
    // console.log('@@@Attendance: '+value);
    this.attendance_date = value;
    this.set_max_mindate(this.attendance_date);
    this.get_attendance_by_teacher_by_date(this._userid, value);
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
        this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
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
        this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
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