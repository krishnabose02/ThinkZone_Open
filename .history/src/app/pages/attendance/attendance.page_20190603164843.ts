import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';

// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from './../../components/notifications/notifications.component';
import { RestApiService } from './../../rest-api.service';

// Camera
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss']
})
export class AttendancePage {
  attendance_status: string = 'Absent';
  student_list: any = [];
  attendance_date: string = new Date().toISOString();
  attendance_day: string = '';
  max_date: string = '';
  min_date: string = '';
  hide_student_list: boolean = false;

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  constructor(
    private formBuilder: FormBuilder,
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private zone: NgZone, 
    // private sanitizer: DomSanitizer,
    private loadingController: LoadingController,
    private camera: Camera,
    private geolocation: Geolocation
  ) {
    const dt = new Date();
    dt.setDate(dt.getDate() - 7);
    console.log(dt.toString());
    this.min_date = dt.toISOString();
    this.max_date = new Date().toISOString();

    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
    this._centerid = '';
    this._centername = '';
    // console.log('###localStorage: ' + JSON.stringify(localStorage));
    this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
    this.getallstudentbyteacher();
    this.getdayname(this.attendance_date);
  }

  getdayname(date) {
    const dy = new Date(date).getDay();
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
    console.log('@@@att. day: ' + this.attendance_day);
  }

  async get_attendance_by_teacher_by_date(userid, date){
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getattendanceofteacherbydate(this._userid, date)
      .subscribe(res => {
        console.log('@@@att. by date: ' + JSON.stringify(res));
        if (res.length > 0) {
          this.hide_student_list = true;
        } else {
          this.hide_student_list = false;
        }
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  /*toggle_onchange(value) {
    console.log('@@@toggle_onchange: ', value);
    if(value) {
      this.attendance_status = 'Present';
    } else {
      this.attendance_status = 'Absent';
    }
  }*/
  attendancedate_onhange(value){
    // console.log('@@@Attendance: '+value);
    this.attendance_date = value;
    this.getdayname(this.attendance_date);
  }

  async set_as_holiday(){
    this.hide_student_list = true;
    const alert = await this.alertController.create({
      header: 'Enter holiday name...',
      inputs: [
                {
                  name: 'holiday',
                  placeholder: 'Holiday'
                }
              ],
      buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: data => {
                    console.log('Cancel clicked');
                    this.hide_student_list = false;
                  }
                },
                {
                  text: 'OK',
                  handler: data => {
                    if (data.holiday.length > 0) {
                      this.save_attendace_holiday(data.holiday);
                    } 
                  }
                }
              ]
    });
    await alert.present();
  }

  segmentChanged(student, value){
    // console.log('@@@Present/Absent: '+value+'    student: '+JSON.stringify(student));
  }
  async getallstudentbyteacher(){
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallstudentsbyteacherid(this._userid)
      .subscribe(res => {
        // console.log('@@@all student list: ' + JSON.stringify(res));
        this.student_list = res;
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
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

  // save attendance
  save_attendace() {
    console.log('save_attendace');
    const data = {
      isholiday : false,
	    holidayname : '',
	    availability : '', // <--
	    userid : this._userid,
	    username : this._username,
	    centerid : '',
	    centername : '',
	    attendancedate : this.attendance_date,
	    attendanceday : this.attendance_day, // <--
	    studentid : '', // <--
	    studentname : '' // <--
    }; 
  }

  // save attendance holiday
  async save_attendace_holiday(holidayname) {
    console.log('save_attendace');
    const data = {
      isholiday : true,
	    holidayname : holidayname,
	    availability : null, // <--
	    userid : this._userid,
	    username : this._username,
	    centerid : null,
	    centername : null,
	    attendancedate : this.attendance_date,
	    attendanceday : this.attendance_day, // <--
	    studentid : null, // <--
	    studentname : null // <--
    }; 
    
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.saveattendance(data)
      .subscribe(res => {
        // console.log('@@@all student list: ' + JSON.stringify(res));
        
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }
}
