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
import { StudentObject } from './studentobject';


@Component({
  selector: 'app-attendancemodal',
  templateUrl: './attendancemodal.page.html',
  styleUrls: ['./attendancemodal.page.scss']
})
export class AttendancemodalPage {
  attendance_status = 'Absent';
  student_list: any = [];
  attendance_list: any = [];
  attendance_date: string = new Date().toISOString();
  attendance_day = '';
  new_student_list: StudentObject[] = [];
  res: any;
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  toolbarshadow = true;
  present = 0;
  total = 0;
  absent = 0;
  unattended = 0;
  errormessage = '';

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
    this.attendance_day = this.res.day;
    this._centerid = '';
    this._centername = '';
    // console.log('###localStorage: ' + JSON.stringify(localStorage));
    this.getallstudentbyteacher();
  }

  // get student list
  async getallstudentbyteacher() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallstudentsbyteacherid(this._userid)
      .subscribe(res => {
        console.log('@@@all student list: ' + JSON.stringify(res));
        this.student_list = res;
        if (this.student_list != null) {
          this.total = this.student_list.length;
          this.unattended = this.total;
          this.student_list.forEach(element => {
            this.new_student_list.push({
              absentbutton: 'circle shadow',
              detail: element,
              presentbutton: 'circle shadow',
              selectionState: 0,
              bgclass: ''
            });
          });
        }
        loading.dismiss();
      }, err => {
        console.log(err);
        this.errormessage = err;
        loading.dismiss();
      });
  }

  // present or absent choosen
  segmentChanged(student, value) {
    this.add_to_attendancelist(student.studentid, student.studentname, student.program, value);
  }

  // add to attendance list
  add_to_attendancelist(studentid, studentname, program, availability) {
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
      studentname : studentname,
      program : program
    };

    if (this.attendance_list.length > 0) {
      // check for record exist or not
      let i = 0, index = -1;
      this.attendance_list.forEach(element => {
        if (element.studentid === studentid) {
          index = i;
          return;
        }
        i++;
      });
      if (index >= 0) {
        this.attendance_list.splice(index, 1, obj);
      } else {
        this.attendance_list.push(obj);
      }
    } else {
      this.attendance_list.push(obj);
    }
    console.log('@@@ attendance_list : ' + JSON.stringify(this.attendance_list));
  }

  // save attendance
  async save_attendace() {
    if (this.student_list.length === this.attendance_list.length) {
      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.saveattendance(this.attendance_list)
        .subscribe(res => {
          // console.log('@@@all student list: ' + JSON.stringify(res));
          this.showAlert('Info', '', 'Attendance saved ' + res['status'] + ' !!!');
          loading.dismiss();
          this.modalController.dismiss({data: 'Ok'});
        }, err => {
          console.log(err);
          loading.dismiss();
        });
    } else {
      this.showAlert('Info', '', 'Please enter attendance of all students.');
    }
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

  logScrolling(event) {
    // console.log(event);
    if (event.detail.currentY === 0) {
      console.log('top');
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }

  setState(s, student) {
    if (s === student.selectionState) {
      return;
    }
    if (student.selectionState === 0) {
      if (s === 1) {
        student.bgclass = 'w2g';
        student.presentbutton = 'w2g circle';
        this.present++;
      } else {
        this.absent++;
        student.bgclass = 'w2r';
        student.absentbutton = 'w2r circle';
      }
    } else if (s === 2) {
      this.absent++;
      this.present--;
      student.bgclass = 'g2r';
      student.presentbutton = 'g2w shadow circle';
      student.absentbutton = 'w2r circle';
      console.log('green to red');
    } else {
      this.present++;
      this.absent--;
      student.bgclass = 'r2g';
      student.presentbutton = 'w2g circle';
      student.absentbutton = 'r2w shadow circle';
      console.log('red to green');
    }
    this.add_to_attendancelist( student.detail.studentid,
                                student.detail.studentname,
                                student.detail.program,
                                (s === 1) ? 'present' : 'absent'
                              );
    student.selectionState = s;
    this.unattended = this.total - this.present - this.absent;
  }
}
