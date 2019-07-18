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

@Component({
  selector: 'app-studentexplor',
  templateUrl: './studentexplor.page.html',
  styleUrls: ['./studentexplor.page.scss']
})
export class StudentExplorPage {
  student_list: any = [];
  student_name: string = '';
  program: string = '';
  class: string = '';
  phone: number = 0;
  gender: string = '';
  dob: string = '';
  father: string = '';

  selected_level: string = '';
  selected_ec_level: string = '';
  selected_math_level: string = '';
  selected_eng_level: string = '';

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
    private zone: NgZone, 
    //private sanitizer: DomSanitizer,
    private loadingController: LoadingController,
    private camera: Camera,
    private geolocation: Geolocation
  ) {
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = '';
    this._centername = '';
    this.getallstudents(this._userid);
  }

  async getallstudents(userid){
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallstudentsbyteacher(userid)
      .subscribe(res => {
        console.log(res);
        this.student_list = res;
        loading.dismiss();
      }, err => {
        console.log(err);
        this.student_list = [];
        loading.dismiss();
      });
  }

  setlevel_ec_onchange(value){
    this.selected_ec_level = value;
  }

  setlevel_pg_math_onchange(value){
    this.selected_math_level = value;
  }

  setlevel_pg_eng_onchange(value){
    this.selected_eng_level = value;
  }

  async openModal(subject,student){
    if(subject == '') this.selected_level = this.selected_ec_level;
    else if( subject == 'math') this.selected_level = this.selected_math_level;
    else if( subject == 'english') this.selected_level = this.selected_eng_level;
    else this.selected_level = '';

    if(this.selected_level == ''){
      this.showAlert('Select Level', '', 'Select level !!!');
    }else{
      const modal = await this.modalController.create({
        component: BaselinePage,
        componentProps: { res: student, subject: subject, level: this.selected_level } //<-- this is used to pass data from  this page to the modal page that will open on click
      });
      modal.onDidDismiss()
        .then((data) => {
          console.log('@@@Modal Data: '+JSON.stringify(data));
          const user = data['data']; // <-- here is data received back from the modal page
      });
      //this.updateMessageStatus(res);
      return await modal.present();
    }
  }

  async signUp(){
    console.log('@@@Student full name: '+this.student_name+'    phone: '+this.phone+'    father: '+this.father);
    if(this.student_name == undefined || this.student_name == null || this.student_name == ''){
      this.showAlert('Verify', '', 'Please check Student full name !!!');
    } else if(this.program == undefined || this.program == null || this.program == ''){
      this.showAlert('Verify', '', 'Please select Program !!!');
    } else if(this.class == undefined || this.class == null || this.class == ''){
      this.showAlert('Verify', '', 'Please select Class !!!');
    //} else if(this.[this.phone == undefined || this.phone == null || this.phone == ''){
    //  this.showAlert('Verify', '', 'Please check Phone !!!');
    } else if(this.gender == undefined || this.gender == null || this.gender == ''){
      this.showAlert('Verify', '', 'Please select Gender !!!');
    } else if(this.dob == undefined || this.dob == null || this.dob == ''){
      this.showAlert('Verify', '', 'Please check DOB !!!');
    } else if(this.father == undefined || this.father == null || this.father == ''){
      this.showAlert('Verify', '', 'Please check Father name !!!');
    } else{
      //this.showAlert('Verify', '', 'OK !!!');
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
      }

      let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.registernewstudent(details)
        .subscribe(res => {
          console.log(res);
          loading.dismiss();
          this.showAlert('Student Registration', '', 'Student registration '+res['status']+' !!!');
        }, err => {
          console.log(err);
          loading.dismiss();
        });
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
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }
}
