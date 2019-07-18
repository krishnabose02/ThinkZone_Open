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
import { RestApiService } from './../../../rest-api.service';


@Component({
  selector: 'app-attendancemodal',
  templateUrl: './attendancemodal.page.html',
  styleUrls: ['./attendancemodal.page.scss']
})
export class AttendancemodalPage {
  attendance_status: string = 'Absent';
  student_list: any = [];
  attendance_date: string = new Date().toISOString();
  is_attendance_taken: boolean = false;
  hide_student_list: boolean = false;

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
    // private sanitizer: DomSanitizer,
    private loadingController: LoadingController
  ) {
    // set min date and max date for the calendar
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
  }

  closeModal() {
    this.modalController.dismiss({data: 'Cancel'});
  }
  
  async get_attendance_by_teacher_by_date(userid, date){
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getattendanceofteacherbydate(this._userid, date)
      .subscribe(res => {
        console.log('@@@att. by date: ' + JSON.stringify(res));
        if (res.length > 0) {
          this.is_attendance_taken = true;
          // this.hide_student_list = true;
        } else {
          this.is_attendance_taken = false;
          // this.hide_student_list = false;
        }
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
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
}
