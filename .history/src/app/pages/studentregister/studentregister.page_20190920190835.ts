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
import { RestApiService } from './../../rest-api.service';


@Component({
  selector: 'app-studentregister',
  templateUrl: './studentregister.page.html',
  styleUrls: ['./studentregister.page.scss']
})
export class StudentregisterPage {
  _id: string = '';
  res: any;
  flag: string = '';
  studentObj: any = {};

  public onRegisterForm: FormGroup;
  class_list: any = [];
  student_name: string = '';
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
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private navParams: NavParams
  ) {
    this.onRegisterForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      father: ['', [Validators.required]]
    });

    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = '';
    this._centername = '';
    
    // modal paramiters
    this.res = this.navParams.data.res;
    console.log('###this.res: ' + JSON.stringify(this.res));
    this.flag = this.res.flag;

    this.initialize_fields(this.flag);
  }

  initialize_fields(flag){
    if(flag == 'edit')
      this._id = this.res.studentObj._id;
    else
      this._id ='';
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
  
  reset(){
    this.student_name = '';
    this.phone = 0;
    this.father = '';
  }

  async new_registration(){
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
      parentsname : this.father,
      registration_date: this.regdate
    }
    console.log('--> details: '+JSON.stringify(details));

    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.registernewstudent(details)
      .subscribe(res => {
        console.log(res);
        loading.dismiss();
        this.reset();
        this.closeModal();
        this.showAlert('Studentregister Registration', '', 'Studentregister registration '+res['status']+' !!!');
        this.navController.navigateBack('/home-results');
      }, err => {
        console.log(err);
        loading.dismiss();
        this.showAlert('Studentregister Registration', '', 'Studentregister registration failed !!!');
      });
  }

  async update_registration(){
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
      parentsname : this.father,
      registration_date: this.regdate
    }
    console.log('--> _id: '+this._id+'    details: '+JSON.stringify(details));

    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.updatestudent(this._id, details)
      .subscribe(res => {
        console.log(res);
        loading.dismiss();
        this.reset();
        this.closeModal();
        this.showAlert('Studentregister Registration', '', 'Studentregister registration '+res['status']+' !!!');
        this.navController.navigateBack('/home-results');
      }, err => {
        console.log(err);
        loading.dismiss();
        this.showAlert('Studentregister Registration', '', 'Studentregister registration failed !!!');
      });
  }

  register_button_click(){
    this.student_name = this.onRegisterForm.value.fullName;
    this.phone = this.onRegisterForm.value.phone;
    this.father = this.onRegisterForm.value.father;
    if(this.student_name == undefined || this.student_name == null || this.student_name == ''){
      this.showAlert('Verify', '', 'Please check Studentregister full name !!!');
    } else if(this.program == undefined || this.program == null || this.program == ''){
      this.showAlert('Verify', '', 'Please select Program !!!');
    } else if(this.class == undefined || this.class == null || this.class == ''){
      this.showAlert('Verify', '', 'Please select Class !!!');
    } else if(this.gender == undefined || this.gender == null || this.gender == ''){
      this.showAlert('Verify', '', 'Please select Gender !!!');
    } else if(this.father == undefined || this.father == null || this.father == ''){
      this.showAlert('Verify', '', 'Please check Father name !!!');
    }/* else if(this.[this.phone == undefined || this.phone == null || this.phone == ''){
        this.showAlert('Verify', '', 'Please check Phone !!!');
    } else if(this.dob == undefined || this.dob == null || this.dob == ''){
      this.showAlert('Verify', '', 'Please check DOB !!!');
    } else if(this.regdate == undefined || this.regdate == null || this.regdate == ''){
      this.showAlert('Verify', '', 'Please check Registration date !!!');
    }*/ else {
      console.log('###flag: '+this.flag);
      if(this.flag == 'new'){
        this.new_registration();
      }else if(this.flag == 'edit'){
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
