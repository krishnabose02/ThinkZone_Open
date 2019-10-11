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
import { RestApiService } from './../../rest-api.service';


@Component({
  selector: 'app-studentregister',
  templateUrl: './studentregister.page.html',
  styleUrls: ['./studentregister.page.scss']
})
export class StudentregisterPage {
  buttonclass = 'hidden';
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  // information from modal res side
  _id = '';
  _studentid = '';
  _studentname = '';
  // _program = '';
  _class = '';
  _phone: number;
  // _gender = '';
  _dob = '';
  _parentsname = '';
  _registration_date = '';

  studentname = '';
  program = '';
  class = '';
  phone = 0;
  gender = '';
  dob = '';
  parentsname = '';
  registration_date = '';

  res: any;
  flag = '';
  studentObj: any = {};
  class_list: any = [];

  hide_class_field = false;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private navParams: NavParams
  ) {
    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
    this._centerid = '';
    this._centername = '';

    // modal paramiters
    this.res = this.navParams.data.res;
    console.log('###this.res: ' + JSON.stringify(this.res));
    this.flag = this.res.flag;

    this.initialize_fields(this.flag);
  }

  initialize_fields(flag) {
    if (flag === 'edit') {
      this._id = this.res.studentObj._id;
      this._studentid = this.res.studentObj.studentid;
      this._studentname = this.res.studentObj.studentname;
      this.program = this.res.studentObj.program;
      this._class = this.res.studentObj.class;
      this._phone = this.res.studentObj.phone;
      this.gender = this.res.studentObj.gender;
      this._dob = this.res.studentObj.dob;
      this._parentsname = this.res.studentObj.parentsname;
      this._registration_date = this.res.studentObj.registration_date;
      this.select_program_onchange(this.program);
    } else {
      this._id = '';
      this._studentid = '';
      this._studentname = '';
      this.program = '';
      this._class = '';
      //this._phone = 0;
      this.gender = '';
      this._dob = '';
      this._parentsname = '';
      this._registration_date = '';
    }
    this.studentname = this._studentname;
    this.program = this.program;
    this.class = this._class;
    this.phone = this._phone;
    this.gender = this.gender;
    this.dob = this._dob;
    this.parentsname = this._parentsname;
    this.registration_date = this._registration_date;
  }

  select_program_onchange(value) {
    console.log('@@@Selected program: ', value);
    this.program = value;
    if (value === 'ece') {
      this.class_list = ['0']; // 0 = Anganwadi
      this.class = '0';
      this.hide_class_field = true;
    } else if (value === 'pge') {
      this.class_list = ['1', '2', '3', '4', '5', '6', '7'];
      this.hide_class_field = false;
    } else {
      this.class_list = [];
      this.hide_class_field = false;
    }

    // this reveals the class list
    this.buttonclass = 'revealer';
  }

  select_class_onchange(value) {
    console.log('@@@Selected class: ', value);
    this.class = value;
  }

  gender_onchange(value) {
    console.log('@@@Selected gender: ', value);
    this.gender = value;
  }

  dob_onhange(value) {
    console.log('@@@Selected dob: ', value);
    this.dob = value;
  }

  regdate_onhange(value) {
    console.log('@@@Selected regdate: ', value);
    this.registration_date = value;
  }

  reset() {
    this.studentname = '';
    this.phone = 0;
    this.parentsname = '';
  }

  async new_registration() {
    const details = {
      userid : this._userid,
      username : this._username,
      centerid : this._centerid,
      centername : this._centername,
      studentid : (new Date).getTime(),
      studentname : this.studentname,
      program : this.program,
      class : this.class,
      phone : this.phone,
      gender : this.gender,
      dob : this.dob,
      parentsname : this.parentsname,
      registration_date: this.registration_date
    };
    console.log('--> details: ' + JSON.stringify(details));

    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.registernewstudent(details)
      .subscribe(res => {
        console.log(res);
        loading.dismiss();
        this.reset();
        this.closeModal();
        this.showAlert('Studentregister Registration', '', 'Studentregister registration ' + res['status'] + ' !!!');
        this.navController.navigateBack('/home-results');
      }, err => {
        console.log(err);
        loading.dismiss();
        this.showAlert('Studentregister Registration', '', 'Studentregister registration failed !!!');
      });
  }

  async update_registration() {
    const details = {
      userid : this._userid,
      username : this._username,
      centerid : this._centerid,
      centername : this._centername,
      studentid : (new Date).getTime(),
      studentname : this.studentname,
      program : this.program,
      class : this.class,
      phone : this.phone,
      gender : this.gender,
      dob : this.dob,
      parentsname : this.parentsname,
      registration_date: this.registration_date
    };
    console.log('--> _id: ' + this._id + '    details: ' + JSON.stringify(details));

    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.updatestudent(this._id, details)
      .subscribe(res => {
        console.log(res);
        loading.dismiss();
        this.reset();
        this.closeModal();
        this.showAlert('Studentregister Registration', '', 'Studentregister registration ' + res['status'] + ' !!!');
        this.navController.navigateBack('/home-results');
      }, err => {
        console.log(err);
        loading.dismiss();
        this.showAlert('Studentregister Registration', '', 'Studentregister registration failed !!!');
      });
  }

  register_button_click() {
    if (this.studentname === undefined || this.studentname == null || this.studentname === '') {
      this.showAlert('Verify', '', 'Please check Studentregister full name !!!');
    } else if (this.program === undefined || this.program == null || this.program === '') {
      this.showAlert('Verify', '', 'Please select Program !!!');
    } else if (this.class === undefined || this.class == null || this.class === '') {
      this.showAlert('Verify', '', 'Please select Class !!!');
    } else if (this.gender === undefined || this.gender == null || this.gender === '') {
      this.showAlert('Verify', '', 'Please select Gender !!!');
    } else if (this.parentsname === undefined || this.parentsname == null || this.parentsname === '') {
      this.showAlert('Verify', '', 'Please check Father name !!!');
    } else {
      console.log('###flag: ' + this.flag);
      if (this.flag === 'new') {
        this.new_registration();
      } else if (this.flag === 'edit') {
        this.update_registration();
      }
    }
  }


  // close modal
  closeModal() {
    this.modalController.dismiss({data: 'Cancel'});
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
