import { Component, ViewChild } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  IonDatetime} from '@ionic/angular';
import { AttendancemodalPage } from './../modal/attendancemodal/attendancemodal.page';
import { HolidaymodalPage } from './../modal/holidaymodal/holidaymodal.page';
import { RestApiService } from './../../rest-api.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss']
})
export class AttendancePage {
  attendance_list: any = [];
  attendance_date: string = new Date().toISOString();
  attendance_day = '';
  max_date = '';
  min_date = '';
  is_attendance_taken = false;

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  date: number;
  month: string;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  clickState = 0;
  holiday_name: any;
  error_message: string;
  toolbarshadow = true;

  @ViewChild('datePicker') datePicker: IonDatetime;
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
    this.date = dt.getDate();
    this.month = this.months[dt.getMonth()];
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
    const dt = new Date(value);
    this.date = dt.getDate();
    this.month = this.months[dt.getMonth()];
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

  // programmatically open the datetime component that picks time
  openDatePicker() {
    this.datePicker.open();
  }

  // Change the button states
  changeState(buttonClicked: string) {
    if (buttonClicked === 'attendance') {
      if (this.clickState === 0) {
        this.takeattendance_onclick();
      } else {
        this.clickState = 0;
        this.holiday_name = '';
        this.error_message = '';
      }
      return;
    } else if (buttonClicked === 'holiday') {
      if (this.clickState === 1) {
        // this.setholiday_onclick();
        this.setholiday();
      } else {
        this.clickState = 1;
      }
    }
  }

  // Copied from Holiday modal
  async setholiday() {
    if (this.holiday_name == null || this.holiday_name.trim() === '') {
      this.error_message = 'Enter a holiday name!';
      return;
    }

    const data = {
      isholiday : true,
      holidayname : this.holiday_name,
      availability : null,
      userid : this._userid,
      username : this._username,
      centerid : null,
      centername : null,
      attendancedate : this.attendance_date,
      attendanceday : this.attendance_day,
      studentid : null,
      studentname : null,
      program: null
    };
    this.save(data);
  }

  async save(data) {
    this.attendance_list = [];
    this.attendance_list.push(data);
    const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.saveattendance(this.attendance_list)
        .subscribe(res => {
          // console.log('@@@all student list: ' + JSON.stringify(res));
          this.showAlert('Info', '', 'Attendance saved ' + res['status'] + ' !!!');
          loading.dismiss();
          // this.modalController.dismiss({data: 'Ok'});
          this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
        }, err => {
          console.log(err);
          this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
          loading.dismiss();
        });
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
