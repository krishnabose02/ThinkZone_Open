import { Component, NgZone } from '@angular/core';
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
import { BaselinePage } from './../modal/baseline/baseline.page';

// api
import { RestApiService } from './../../rest-api.service';

// Camera
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { StudentregisterPage } from '../studentregister/studentregister.page';

@Component({
  selector: 'app-studentexplor',
  templateUrl: './studentexplor.page.html',
  styleUrls: ['./studentexplor.page.scss']
})
export class StudentExplorPage {
  student_list: any = [];
  student_name = '';
  program = '';
  class = '';
  phone = 0;
  gender = '';
  dob = '';
  father = '';

  selected_level = '';
  selected_ec_level = '';
  selected_math_level = '';
  selected_eng_level = '';
  selected_odia_level = '';

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;
  toolbarshadow = true;
  levels = [1, 2, 3, 4, 5];
  ece_levels = [1, 2, 3];
  errormessage = '';
  displaystudent: any;
  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private zone: NgZone,
    // private sanitizer: DomSanitizer,
    private loadingController: LoadingController,
    private camera: Camera,
    private geolocation: Geolocation
  ) {
    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
    this._centerid = '';
    this._centername = '';
    this.getallstudents(this._userid);
  }

  async getallstudents(userid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallstudentsbyteacher(userid)
      .subscribe(res => {
        console.log('###student_list: '+JSON.stringify(res));
        this.student_list = res;
        this.student_list.forEach(element => {
          element.hidden = true;
          element.english = {
            hidden: true,
            val: element.eng_level
          };
          element.math = {
            hidden: true,
            val: element.math_level
          };
          element.odia = {
            hidden: true,
            val: element.odia_level
          };
          element.ece = {
            hidden: true,
            val: element.ec_level
          };
        });
        loading.dismiss();
      }, err => {
        console.log(err);
        this.errormessage = err;
        this.student_list = [];
        loading.dismiss();
      });
  }

  setlevel_ec_onchange(value) {
    this.selected_ec_level = value;
  }

  setlevel_pg_math_onchange(value) {
    this.selected_math_level = value;
  }

  setlevel_pg_eng_onchange(value) {
    this.selected_eng_level = value;
  }

  setlevel_pg_odia_onchange(value) {
    this.selected_odia_level = value;
  }

  async openModal2(subject, student) {
    if (subject === '') {
      this.selected_level = student.ece.val;
    } else if (subject === 'math') {
      this.selected_level = student.math.val;
    } else if (subject === 'english') {
      this.selected_level = student.english.val;
    } else if (subject === 'odia') {
      this.selected_level = student.odia.val;
    }

    const modal = await this.modalController.create({
      component: BaselinePage,
      componentProps: {
          res: student,
          subject: subject,
          selected_level: this.selected_level
      } // <-- this is used to pass data from  this page to the modal page that will open on click
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log('@@@Modal Data: ' + JSON.stringify(data));
        this.getallstudents(this._userid); // <-- here is data received back from the modal page
    });
    return await modal.present();

  }
  async openModal(subject, student) {
    if (subject === '') {
      this.selected_level = this.selected_ec_level;
    } else if ( subject === 'math') {
      this.selected_level = this.selected_math_level;
    } else if ( subject === 'english') {
      this.selected_level = this.selected_eng_level;
    } else if ( subject === 'odia') {
      this.selected_level = this.selected_odia_level;
    } else {
      this.selected_level = '';
    }

    if (this.selected_level === '') {
      this.showAlert('Select Level', '', 'Select level !!!');
    } else {
      const modal = await this.modalController.create({
        component: BaselinePage,
        componentProps: {
            res: student,
            subject: subject,
            selected_level: this.selected_level
        } // <-- this is used to pass data from  this page to the modal page that will open on click
      });
      modal.onDidDismiss()
        .then((data) => {
          console.log('@@@Modal Data: ' + JSON.stringify(data));
          this.getallstudents(this._userid); // <-- here is data received back from the modal page
      });
      // this.updateMessageStatus(res);
      return await modal.present();
    }
  }

  async signUp() {
    console.log('@@@Student full name: ' + this.student_name + '    phone: ' + this.phone + '    father: ' + this.father);
    if (this.student_name === undefined || this.student_name == null || this.student_name === '') {
      this.showAlert('Verify', '', 'Please check Student full name !!!');
    } else if (this.program === undefined || this.program == null || this.program === '') {
      this.showAlert('Verify', '', 'Please select Program !!!');
    } else if (this.class === undefined || this.class == null || this.class === '') {
      this.showAlert('Verify', '', 'Please select Class !!!');
    // } else if(this.[this.phone == undefined || this.phone == null || this.phone == ''){
    //  this.showAlert('Verify', '', 'Please check Phone !!!');
    } else if (this.gender === undefined || this.gender == null || this.gender === '') {
      this.showAlert('Verify', '', 'Please select Gender !!!');
    } else if (this.dob === undefined || this.dob == null || this.dob === '') {
      this.showAlert('Verify', '', 'Please check DOB !!!');
    } else if (this.father === undefined || this.father == null || this.father === '') {
      this.showAlert('Verify', '', 'Please check Father name !!!');
    } else {
      // this.showAlert('Verify', '', 'OK !!!');
      // proceed to save
      const details = {
        userid : this._userid,
        username : this._username,
        centerid : this._centerid,
        centername : this._centername,
        studentid : (new Date).getTime(),
        studentname : this.student_name,
        program : this.program,
        class : this.class,
        phone : this.phone,
        gender : this.gender,
        dob : this.dob,
        parentsname : this.father
      };

      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.registernewstudent(details)
        .subscribe(res => {
          console.log(res);
          loading.dismiss();
          this.showAlert('Student Registration', '', 'Student registration ' + res['status'] + ' !!!');
        }, err => {
          console.log(err);
          loading.dismiss();
        });
    }
  }

  async open_register_modal(studentObj, flag) {
    /*  studentObj == null <-- new user register
        else               <-- existing user update
    */
    const modal = await this.modalController.create({
      component: StudentregisterPage,
      componentProps: { res: {flag: flag, studentObj: studentObj} }
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log('@@@Modal Data: ' + JSON.stringify(data));
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

  delete_button_click(student) {
    const id = student._id;
    const studentname = student.studentname;
    this.showConfirm('Confirmation !!!', '', 'Are you sure to delete this records of ' + studentname + '?', id);
  }

  // confirm box
  async showConfirm(header: string, subHeader: string, message: string, id: any) {
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
          handler: () => {
            console.log('Confirm Okay');
            this.delete_student(id);
          }
        }
      ]
    });
    await alert.present();
  }

  async delete_student(id) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.deletestudentbyid(id)
      .subscribe(res => {
        console.log(res);
        this.getallstudents(this._userid);
        loading.dismiss();
      }, err => {
        console.log(err);
        this.getallstudents(this._userid);
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

  flipStudentDisplay(student) {
    // this.displaystudent.english.hidden = true;
    // this.displaystudent.english.hidden = true;
    // this.displaystudent.english.hidden = true;
    // this.displaystudent.english.hidden = true;
    // if (this.displaystudent.studentname === student.studentname) {
    //   this.displaystudent.hidden = true;
    // } else {
    //   this.displaystudent.hidden = true;
    //   student.hidden = false;
    //   this.displaystudent = student;
    // }

    if (student.hidden) {

      this.student_list.forEach(element => {
        element.hidden = true;
        if (element.program === 'pge') {
          element.english.val = student.eng_level;
          element.english.hidden = true;
          element.math.val = student.math_level;
          element.math.hidden = true;
          element.odia.val = student.odia_level;
          element.odia.hidden = true;
        } else {
          element.ece.val = student.ec_level;
          element.ece.hidden = true;
        }
      });

      student.hidden = false;
      if (student.program === 'pge') {
        student.english.val = student.eng_level;
        student.english.hidden = true;
        student.math.val = student.math_level;
        student.math.hidden = true;
        student.odia.val = student.odia_level;
        student.odia.hidden = true;
      } else {
        student.ece.val = student.ec_level;
        student.ece.hidden = true;
      }

      return;
    }
    student.hidden = true;
    if (student.program === 'pge') {
      student.english.val = student.eng_level;
      student.english.hidden = true;
      student.math.val = student.math_level;
      student.math.hidden = true;
      student.odia.val = student.odia_level;
      student.odia.hidden = true;
    } else {
      student.ece.val = student.ec_level;
      student.ece.hidden = true;
    }
  }

  addNewStudent() {
    this.navController.navigateForward('/student');
  }

}
