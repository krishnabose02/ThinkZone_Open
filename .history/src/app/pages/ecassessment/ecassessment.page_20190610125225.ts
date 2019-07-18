import { Component, NgZone } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';
import { EceassessmentmodalPage } from './../modal/eceassessmentmodal/eceassessmentmodal.page';
import { RestApiService } from './../../rest-api.service';

@Component({
  selector: 'app-ecassessment',
  templateUrl: './ecassessment.page.html',
  styleUrls: ['./ecassessment.page.scss']
})
export class EcassessmentPage {
  selected_quarter: string = '';
  disable_fillmarks_button: boolean = true;
  month_diff: number;
  userobj: any = {};
  userreg_date: string = '';
  student_list: any = [];
  quarter_list: any = [];

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
    this.getallstudentbyteacher();
  }

  // get student list
  async getallstudentbyteacher(){
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallstudentsbyteacherid(this._userid)
      .subscribe(res => {
        console.log('@@@all student list: ' + JSON.stringify(res));
        this.student_list = res;
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
        this.calculateQuarter(new Date(this.userreg_date), new Date());
        //this.calculateQuarter(new Date(2018,11,11), new Date(2019,5,7));
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  calculateQuarter(fromDate, toDate){
    // month difference
    let months = (toDate.getMonth() - fromDate.getMonth()) + (12 * (toDate.getFullYear() - fromDate.getFullYear())) + 1;
    if(toDate.getDate() < fromDate.getDate()){
        months--;
    }
    this.month_diff = months;
    console.log('@@@month_diff: ' + this.month_diff);

    // make mont_diff a +ve number
    this.month_diff = (this.month_diff < 0) ? (this.month_diff * -1) : this.month_diff;

    // create quarter list
    if(this.month_diff >= 1 && this.month_diff <= 3){
      console.log('>=1 month_diff <=3');
      const q1 = { value: 'quarter1', text: 'Quarter 1', disabled: false };
      const q2 = { value: 'quarter2', text: 'Quarter 2', disabled: true };
      const q3 = { value: 'quarter3', text: 'Quarter 3', disabled: true };
      const q4 = { value: 'quarter4', text: 'Quarter 4', disabled: true };
      this.quarter_list = [];
      this.quarter_list.push(q1);
      this.quarter_list.push(q2);
      this.quarter_list.push(q3);
      this.quarter_list.push(q4);
    } else if(this.month_diff >= 4 && this.month_diff <= 6){
      console.log('>=4 month_diff <=6');
      const q1 = { value: 'quarter1', text: 'Quarter 1', disabled: true };
      const q2 = { value: 'quarter2', text: 'Quarter 2', disabled: false };
      const q3 = { value: 'quarter3', text: 'Quarter 3', disabled: true };
      const q4 = { value: 'quarter4', text: 'Quarter 4', disabled: true };
      this.quarter_list = [];
      this.quarter_list.push(q1);
      this.quarter_list.push(q2);
      this.quarter_list.push(q3);
      this.quarter_list.push(q4);
    } else if(this.month_diff >= 67 && this.month_diff <= 9){
      console.log('>=7 month_diff <=9');
      const q1 = { value: 'quarter1', text: 'Quarter 1', disabled: true };
      const q2 = { value: 'quarter2', text: 'Quarter 2', disabled: true };
      const q3 = { value: 'quarter3', text: 'Quarter 3', disabled: false };
      const q4 = { value: 'quarter4', text: 'Quarter 4', disabled: true };
      this.quarter_list = [];
      this.quarter_list.push(q1);
      this.quarter_list.push(q2);
      this.quarter_list.push(q3);
      this.quarter_list.push(q4);
    } else if(this.month_diff >= 10 && this.month_diff <= 12){
      console.log('>=10 month_diff <=12');
      const q1 = { value: 'quarter1', text: 'Quarter 1', disabled: true };
      const q2 = { value: 'quarter2', text: 'Quarter 2', disabled: true };
      const q3 = { value: 'quarter3', text: 'Quarter 3', disabled: true };
      const q4 = { value: 'quarter4', text: 'Quarter 4', disabled: false };
      this.quarter_list = [];
      this.quarter_list.push(q1);
      this.quarter_list.push(q2);
      this.quarter_list.push(q3);
      this.quarter_list.push(q4);
    }
  }
  
  // quarter on change event
  quarter_onchange(value){
    console.log('@@@selected_quarter: '+value);
    this.selected_quarter = value;

    if(this.selected_quarter.length > 0){
      this.disable_fillmarks_button = false;
    } else {
      this.disable_fillmarks_button = true;
    }
  }

  // ece fillmarks button click
  async ece_fillmarks_btnclick(slist){
    const modal = await this.modalController.create({
      component: EceassessmentmodalPage,
      componentProps: { res: {userid: this._userid, username: this._username, studentid: slist.studentid, studentname: slist.studentname, program: slist.program, class: slist.class, stage: this.selected_quarter} } 
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