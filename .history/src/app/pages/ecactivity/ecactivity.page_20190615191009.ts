import { Component, NgZone } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';
import { RestApiService } from './../../rest-api.service';
import { PgeengassessmentmodalPage } from './../modal/pgeengassessmentmodal/pgeengassessmentmodal.page';
import { PgemathassessmentmodalPage } from './../modal/pgemathassessmentmodal/pgemathassessmentmodal.page';

@Component({
  selector: 'app-ecactivity',
  templateUrl: './ecactivity.page.html',
  styleUrls: ['./ecactivity.page.scss']
})
export class EcactivityPage {
  selected_month: string = '';
  selected_week: string = '';
  activity_heading: string ='';
  disable_fillmarks_button: boolean = true;
  month_diff: number;
  userobj: any = {};
  userreg_date: string = '';
  student_list: any = [];
  month_list: any = [];
  week_list: any = [];

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
    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
    this._centerid = '';
    this._centername = '';

    this.getuserbyid(this._userid);
    //this.getallstudentbyteacher();
  }

  // get student list
  async getallstudentbyteacher(){
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallstudentsbyteacherid(this._userid)
      .subscribe(res => {
        console.log('@@@all student list: ' + JSON.stringify(res));
        res.forEach(element => {
          if(element.program == 'pge'){
            this.student_list.push(element);
          }
        });
        
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
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
    console.log('@@@month_diff: ' + this.month_diff);

    // make mont_diff a +ve number
    this.month_diff = (this.month_diff < 0) ? (this.month_diff * -1) : this.month_diff;
    let obj = {};
    this.month_list = [];
    for (let i = 1; i <= 12; i++) {
      if( i <= this.month_diff){
        obj = { value: 'month'+i, text: 'Month '+i, disabled: false};
      }else{
        obj = { value: 'month'+i, text: 'Month '+i, disabled: true};
      }
     
      this.month_list.push(obj);
    }
    console.log('@@@month_list: ' + JSON.stringify(this.month_list));
  }
  
  // month on change event
  month_onchange(value){
    console.log('@@@selected_month: '+value);
    this.selected_month = value;
    let obj = {};
    this.week_list = [];
    for (let i = 1; i <= 4; i++) {
      obj = { value: 'week'+i, text: 'Week '+i};
      this.week_list.push(obj);
    }

    // set activity heading
    if(this.selected_month.trim().length > 0 && this.selected_week.trim().length > 0){
      this.activity_heading = this.selected_month.toUpperCase()+' '+this.selected_week.toUpperCase();
    }


    /*
    this.selected_month = value;
    if(this.selected_month.length > 0){
      this.disable_fillmarks_button = false;
    } else {
      this.disable_fillmarks_button = true;
    }
    */
  }

  week_onchange(value){
    console.log('@@@selected_week: '+value);
    this.selected_week = value;

    // set activity heading
    if(this.selected_month.trim().length > 0 && this.selected_week.trim().length > 0){
      this.activity_heading = this.selected_month.toUpperCase()+' - '+this.selected_week.toUpperCase();
    }
  }

  // ece fillmarks button click
  async pge_fillmarks_btnclick(slist, subject){
    console.log('@@@Subject selected: '+subject);
    if(subject === 'eng'){
      // call eng assessment modal
      const modal = await this.modalController.create({
        component: PgeengassessmentmodalPage,
        componentProps: { res: {userid: this._userid, username: this._username, studentid: slist.studentid, studentname: slist.studentname, program: slist.program, class: slist.class, stage: this.selected_month} } 
      });
      modal.onDidDismiss()
        .then((data) => {
          console.log('@@@Modal Data: '+JSON.stringify(data));
          //this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
      });
      return await modal.present();
    }else if(subject === 'math'){
      // call math assessment modal
      const modal = await this.modalController.create({
        component: PgemathassessmentmodalPage,
        componentProps: { res: {userid: this._userid, username: this._username, studentid: slist.studentid, studentname: slist.studentname, program: slist.program, class: slist.class, stage: this.selected_month} } 
      });
      modal.onDidDismiss()
        .then((data) => {
          console.log('@@@Modal Data: '+JSON.stringify(data));
          //this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
      });
      return await modal.present();
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
}