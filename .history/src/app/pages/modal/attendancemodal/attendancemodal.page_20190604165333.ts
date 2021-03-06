import { Component, NgZone } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  NavParams } from '@ionic/angular';

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
  attendance_list: any = [];
  attendance_date: string = new Date().toISOString();
  attendance_day: string = '';

  res: any;
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
    public navParams: NavParams
  ) {
    // modal paramiters
    this.res = this.navParams.data.res;
    console.log('###this.res: ' + JSON.stringify(this.res));

    this._userid = this.res.userid;
    this._username = this.res.username;
    this.attendance_date = this.res.date;
    this._centerid = '';
    this._centername = '';
    // console.log('###localStorage: ' + JSON.stringify(localStorage));
    this.getallstudentbyteacher();
  }

  // get student list
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

  // present or absent choosen
  segmentChanged(student, value){
    // console.log('@@@Present/Absent: '+value+'    student: '+JSON.stringify(student));
    this.add_to_attendancelist(student.studentid, student.studentname, value);
  }

  // add to attendance list
  add_to_attendancelist(studentid, studentname, availability){
    if(this.attendance_list.length > 0){

    }else{
      const obj = {
        isholiday : false,
        holidayname : '',
        availability : availability, 
        userid : this._userid,
        username : this._username,
        centerid : '',
        centername : '',
        attendancedate : this.attendance_date,
        attendanceday : this.attendance_day, 
        studentid : studentid, 
        studentname : studentname
      };
      this.attendance_list.push(obj);
    }
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
  
  // close modal
  closeModal() {
    this.modalController.dismiss({data: 'Cancel'});
  }
}
