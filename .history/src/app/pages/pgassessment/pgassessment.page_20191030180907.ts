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
import { EceassessmentmodalPage } from '../modal/eceassessmentmodal/eceassessmentmodal.page';

@Component({
  selector: 'app-pgassessment',
  templateUrl: './pgassessment.page.html',
  styleUrls: ['./pgassessment.page.scss']
})
export class PgassessmentPage {
  selected_month = '';
  disable_fillmarks_button = true;
  month_diff: number;
  userobj: any = {};
  userreg_date = '';
  student_list: any = [];
  month_list: any[] = [];

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;
  toolbarshadow = true;

  // added on 25-10-2019 to segregrate assessment view. i.e. Month -> Language(eng, math, odia) - > Level(1, 2, 3, 4, 5)
  preferedlanguage: string = localStorage.getItem("_language");

  pge_eng_all: any = [];
  pge_eng_l1: any = [];
  pge_eng_l2: any = [];
  pge_eng_l3: any = [];
  pge_eng_l4: any = [];
  pge_eng_l5: any = [];

  pge_math_all: any = [];
  pge_math_l1: any = [];
  pge_math_l2: any = [];
  pge_math_l3: any = [];
  pge_math_l4: any = [];
  pge_math_l5: any = [];

  pge_odia_all: any = [];
  pge_odia_l1: any = [];
  pge_odia_l2: any = [];
  pge_odia_l3: any = [];
  pge_odia_l4: any = [];
  pge_odia_l5: any = [];



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
  async getallstudentbyteacher() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallstudentsbyteacherid(this._userid)
      .subscribe(res => {
        console.log('@@@all student list: ' + JSON.stringify(res));
        res.forEach(element => {
          if (element.program === 'pge') {
            this.student_list.push(element);
          }
        });
        this.format_student_list(res);
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  format_student_list(student_list) {
    student_list.forEach(element => {
      if (element.program === 'pge' && element.eng_level === '1') {
          this.pge_eng_l1.push(element);
      } else if (element.program === 'pge' && element.eng_level === '2') {
          this.pge_eng_l2.push(element);
      } else if (element.program === 'pge' && element.eng_level === '3') {
          this.pge_eng_l3.push(element);
      } else if (element.program === 'pge' && element.eng_level === '4') {
          this.pge_eng_l4.push(element);
      } else if (element.program === 'pge' && element.eng_level === '5') {
          this.pge_eng_l5.push(element);
      }

      if (element.program === 'pge' && element.math_level === '1') {
          this.pge_math_l1.push(element);
      } else if (element.program === 'pge' && element.math_level === '2') {
          this.pge_math_l2.push(element);
      } else if (element.program === 'pge' && element.math_level === '3') {
          this.pge_math_l3.push(element);
      } else if (element.program === 'pge' && element.math_level === '4') {
          this.pge_math_l4.push(element);
      } else if (element.program === 'pge' && element.math_level === '5') {
          this.pge_math_l5.push(element);
      }

      if (element.program === 'pge' && element.odia_level === '1') {
          this.pge_odia_l1.push(element);
      } else if (element.program === 'pge' && element.odia_level === '2') {
          this.pge_odia_l2.push(element);
      } else if (element.program === 'pge' && element.odia_level === '3') {
          this.pge_odia_l3.push(element);
      } else if (element.program === 'pge' && element.odia_level === '4') {
          this.pge_odia_l4.push(element);
      } else if (element.program === 'pge' && element.odia_level === '5') {
          this.pge_odia_l5.push(element);
      }

    });
    this.pge_eng_all.push(this.pge_eng_l1);
    this.pge_eng_all.push(this.pge_eng_l2);
    this.pge_eng_all.push(this.pge_eng_l3);
    this.pge_eng_all.push(this.pge_eng_l4);
    this.pge_eng_all.push(this.pge_eng_l5);

    this.pge_math_all.push(this.pge_math_l1);
    this.pge_math_all.push(this.pge_math_l2);
    this.pge_math_all.push(this.pge_math_l3);
    this.pge_math_all.push(this.pge_math_l4);
    this.pge_math_all.push(this.pge_math_l5);

    this.pge_odia_all.push(this.pge_odia_l1);
    this.pge_odia_all.push(this.pge_odia_l2);
    this.pge_odia_all.push(this.pge_odia_l3);
    this.pge_odia_all.push(this.pge_odia_l4);
    this.pge_odia_all.push(this.pge_odia_l5);

    // console.log('@@@pge_eng_all: ' + JSON.stringify(this.pge_eng_all) + '    @@@pge_math_all: ' + JSON.stringify(this.pge_math_all) + '    @@@pge_odia_all: ' + JSON.stringify(this.pge_odia_all));
  }

  async getuserbyid(userid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getuserbyuserid(userid).subscribe(res => {
        if (res.length > 0) {
          this.userobj = res[0];
          this.userreg_date = res[0].createdon;
        }
        // console.log('@@@userobj: ' + JSON.stringify(this.userobj));
        // console.log('@@@userreg_date: ' + this.userreg_date);
        this.calculatemonth(new Date(this.userreg_date), new Date());
        // this.calculatemonth(new Date(2018,11,11), new Date(2019,5,7));
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  calculatemonth(fromDate, toDate) {
    // month difference
    let months = (toDate.getMonth() - fromDate.getMonth()) + (12 * (toDate.getFullYear() - fromDate.getFullYear())) + 1;
    if (toDate.getDate() < fromDate.getDate()) {
        months--;
    }
    this.month_diff = months;
    console.log('@@@month_diff: ' + this.month_diff);

    // make mont_diff a +ve number
    this.month_diff = (this.month_diff < 0) ? (this.month_diff * -1) : this.month_diff;
    let obj = {};
    this.month_list = [];
    for (let i = 1; i <= 12; i++) {
      if ( i <= this.month_diff) {
        obj = { value: 'month' + i, text: 'Month ' + i, disabled: false};
      } else {
        obj = { value: 'month' + i, text: 'Month ' + i, disabled: true};
      }

      this.month_list.push(obj);
    }
    console.log('@@@month_list: ' + JSON.stringify(this.month_list));

    const temp = [];
    this.month_list.forEach(element => {
      if (!element.disabled) {
        temp.push(element);
      }
    });
    this.month_list = temp;
    console.log(this.month_list);
  }

  // month on change event
  month_onchange(value) {
    console.log('@@@selected_month: ' + value);
    this.selected_month = value;

    if (this.selected_month.length > 0) {
      this.disable_fillmarks_button = false;
    } else {
      this.disable_fillmarks_button = true;
    }
  }

  // ece fillmarks button click
  async pge_fillmarks_btnclick(slist, subject) {
    if (this.disable_fillmarks_button) {
      alert('please select a month first!');
      return;
    }

    let preferedlanguage = localStorage.getItem('_language');
    let selected_subject = "";

    if (subject === 'eng') {
      selected_subject = 'english';
    }else if (subject === 'math') {
      selected_subject = 'math';
    }else if (subject === 'odia') {
      selected_subject = 'odia';
    }
    console.log('@@@Subject: ' + subject+'     Selected Subject: '+selected_subject+'    Prefered Language: '+preferedlanguage);
    console.log('@@@Slist: ' + JSON.stringify(slist));

    const modal = await this.modalController.create({
      component: EceassessmentmodalPage,
      componentProps: {
        res: {
          preferedlanguage: preferedlanguage,
          userid: this._userid,
          username: this._username,
          studentid: slist.studentid,
          studentname: slist.studentname,
          program: slist.program,
          level: slist.level,
          stage: this.selected_month,
          subject: selected_subject
        }
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log('@@@Modal Data: ' + JSON.stringify(data));
        // this.get_attendance_by_teacher_by_date(this._userid, this.attendance_date);
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
