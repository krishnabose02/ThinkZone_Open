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
  selector: 'app-training1',
  templateUrl: './training1.page.html',
  styleUrls: ['./training1.page.scss']
})
export class Training1Page {
  public onRegisterForm: FormGroup;
  class_list: any = [];
  training1_name: string = '';
  program: string = '';
  class: string = '';
  phone: number = 0;
  gender: string = '';
  dob: string = '';
  father: string = '';
  regdate: string = '';

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  hide_class_field: boolean = false;

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
      this.class_list = ['0']; // 0 = Anganwadi
      this.class = '0';
      this.hide_class_field = true;
    } else if(value == 'pge'){
      this.class_list = ['1', '2', '3', '4', '5', '6', '7'];
      this.hide_class_field = false;
    } else {
      this.class_list = [];
      this.hide_class_field = false;
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

  regdate_onhange(value){
    console.log('@@@Selected regdate: ', value);
    this.regdate = value;
  }

  async explor(){
    this.navController.navigateForward('/training1explor');
  }

  reset(){
    this.training1_name = '';
    this.phone = 0;
    this.father = '';
  }

  async signUp(){
    this.training1_name = this.onRegisterForm.value.fullName;
    this.phone = this.onRegisterForm.value.phone;
    this.father = this.onRegisterForm.value.father;

    console.log('@@@Training1 full name: '+this.training1_name+'    phone: '+this.phone+'    father: '+this.father);
    if(this.training1_name == undefined || this.training1_name == null || this.training1_name == ''){
      this.showAlert('Verify', '', 'Please check Training1 full name !!!');
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
    } else if(this.regdate == undefined || this.regdate == null || this.regdate == ''){
      this.showAlert('Verify', '', 'Please check Registration date !!!');
    } else {
      //this.showAlert('Verify', '', 'OK !!!');
      // proceed to save
      const details = {
        userid : this._userid,
        username : this._username,
        centerid : this._centerid,
        centername : this._centername,
        training1id : (new Date).getTime(),
        training1name : this.training1_name,
        program : this.program,
        class : this.class,
        phone : this.phone,
        gender : this.gender,
        dob : this.dob,
        parentsname : this.father,
        registration_date: this.regdate
      }

      let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.registernewtraining1(details)
        .subscribe(res => {
          console.log(res);
          loading.dismiss();
          this.reset();
          this.showAlert('Training1 Registration', '', 'Training1 registration '+res['status']+' !!!');
          this.navController.navigateBack('/home-results');
        }, err => {
          console.log(err);
          loading.dismiss();
          this.showAlert('Training1 Registration', '', 'Training1 registration failed !!!');
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
