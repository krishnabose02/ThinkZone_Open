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




  _operationdate: string;
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  image:any='';
  imagebase64: any;
  confirmed: number = 0;

  
  
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

    this._operationdate = localStorage.getItem("_operationdate");
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = localStorage.getItem("_centerid");
    this._centername = localStorage.getItem("_centername");
    //console.log('###localStorage: '+JSON.stringify(localStorage));
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

  signUp(){
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
      this.showAlert('Verify', '', 'OK !!!');
    }
  }

  goToCentersList() {
    this.navController.navigateBack('/home-results');
  }

  // Camera
  async takePicture() {
   const options: CameraOptions = {
      quality: 50, // 100
      //destinationType: this.camera.DestinationType.FILE_URI,  // <- save as jpeg in local disk
      destinationType: this.camera.DestinationType.DATA_URL,   // <- returns base64 code
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 200,
      targetHeight: 200
    }
    
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log('$$$image Data: '+JSON.stringify(imageData));
      this.imagebase64 = imageData;
      //this.image=(<any>window).Ionic.WebView.convertFileSrc(imageData);
      this.savePictureasBase64(imageData);
      
    }, (err) => {
    // Handle error
    alert("error "+JSON.stringify(err))
    });
    
    // format of base 64 is data:image/png;base64,.............
    //let imagebase64 = image.webPath;
    
  }

  async savePictureasBase64(imageData){
    let body = {
      userid : localStorage.getItem("_userid"),
	    username : localStorage.getItem("_username"),
      centerid : localStorage.getItem("_centerid"),
      centername : localStorage.getItem("_centername"),
      imageurl : "",
      imagebase64 : imageData
    }
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.savecenterimage(body)
      .subscribe(res => {
        console.log(res);
        loading.dismiss();
        this.showAlert('Pic Sharing', 'Center image', 'Image sharing '+res['status']+' !!!');
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  // get geolocation
  async getGeolocation() {
    try {
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log("lat" + resp.coords.latitude + "- long" + resp.coords.longitude);
        let body = {
          userid : localStorage.getItem("_userid"),
          username : localStorage.getItem("_username"),
          centerid : localStorage.getItem("_centerid"),
          centername : localStorage.getItem("_centername"),
          latlng : {lat: resp.coords.latitude, lng: resp.coords.longitude}
        }
        this.showConfirm('Confirmation  !','', 'Do you want to share your current location?<br>latitude:<strong>'+resp.coords.latitude+'</strong>   longitude:<strong>'+resp.coords.longitude+'</strong>', body);
      }).catch((error) => {
        console.log('Error getting location', error);
      });      
    } catch(e) {
      alert('WebView geo error');
      console.error(e);
    }
  }

  async savegeolocation(body) {
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.savegeolocation(body)
      .subscribe(res => {
        console.log(res);
        loading.dismiss();
        this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');         
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
            this.confirmed = 0;
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.confirmed = 1;
            console.log('Confirm Okay');
            this.savegeolocation(body);
          }
        }
      ]
    });
    await alert.present();
  }
}
