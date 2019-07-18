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
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from './../../components/notifications/notifications.component';
import { RestApiService } from './../../rest-api.service';

// Camera
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss']
})
export class StudentPage {
  public onRegisterForm: FormGroup;
  class_list: any = [];
  student_name: string = '';
  program: string = '';
  class: string = '';
  phone: number = 0;
  gender: string = '';
  dob: string = '';
  father: string = '';

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
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private zone: NgZone, 
    //private sanitizer: DomSanitizer,
    private loadingController: LoadingController,
    private camera: Camera,
    private geolocation: Geolocation
  ) {
    this.onRegisterForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      father: ['', [Validators.required]]
    });

    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = '';
    this._centername = '';
    console.log('###localStorage: '+JSON.stringify(localStorage));
  }

  select_program_onchange(value){
    console.log('@@@Selected program: ', value);
    this.program = value;
    if(value == 'ece'){
      this.class_list = ['Anganwadi'];
    } else if(value == 'pge'){
      this.class_list = ['class1', 'class2', 'class3', 'class4', 'class5', 'class6', 'class7'];
    } else {
      this.class_list = [];
    }
  }

  select_class_onchange(value){
    console.log('@@@Selected class: ', value);
    this.class = value;
  }

  gender_onchange(value){
    console.log('@@@Selected gender: ', value);
    this.gender = value;
  }

  dob_onhange(value){
    console.log('@@@Selected dob: ', value);
    this.dob = value;
  }

  async signUp(){
    this.student_name = this.onRegisterForm.value.fullName;
    this.phone = this.onRegisterForm.value.phone;
    this.father = this.onRegisterForm.value.father;

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
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }
}
