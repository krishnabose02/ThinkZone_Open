import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-holidaymodal',
  templateUrl: './holidaymodal.page.html',
  styleUrls: ['./holidaymodal.page.scss']
})
export class HolidaymodalPage {
  public setholidayFormGroup: FormGroup;
  attendance_status: string = '';
  student_list: any = [];
  attendance_list: any = [];
  attendance_date: string = new Date().toISOString();
  attendance_day: string = '';
  holidayname: string = '';

  res: any;
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
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    public navParams: NavParams
  ) {
    this.setholidayFormGroup = this.formBuilder.group({
      holidayname: ['', [Validators.required]]
    });
    
    // modal paramiters
    this.res = this.navParams.data.res;
    console.log('###this.res: ' + JSON.stringify(this.res));

    this._userid = this.res.userid;
    this._username = this.res.username;
    this.attendance_date = this.res.date;
    this.attendance_day = this.res.day;
    this._centerid = '';
    this._centername = '';
  }


  // add to attendance list
  add_to_attendancelist(studentid, studentname, program, availability){
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

    if(this.attendance_list.length > 0){
      // check for record exist or not
      let i = 0, index = -1;
      this.attendance_list.forEach(element => {
        if(element.studentid == studentid){
          index = i;
          return;
        }
        i++;
      });
      if(index >= 0){
        this.attendance_list.splice(index,1,obj);
      }else{
        this.attendance_list.push(obj);
      }
    }else{
      this.attendance_list.push(obj);
    }
    console.log('@@@ attendance_list : '+JSON.stringify(this.attendance_list));
  }
  
  // save attendance
  async setholiday(){
    this.holidayname = this.setholidayFormGroup.value.holidayname;
    const data = {
      isholiday : true,
      holidayname : this.holidayname,
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
    const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.saveattendance(data)
        .subscribe(res => {
          // console.log('@@@all student list: ' + JSON.stringify(res));
          this.showAlert('Info','','Attendance saved '+res['status']+' !!!');
          loading.dismiss();
          this.modalController.dismiss({data: 'Ok'});
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
  
  // close modal
  closeModal() {
    this.modalController.dismiss({data: 'Cancel'});
  }
}
