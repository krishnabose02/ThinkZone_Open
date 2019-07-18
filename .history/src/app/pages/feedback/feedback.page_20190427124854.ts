import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';

import { RestApiService } from './../../rest-api.service';

  
// Camera
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  feedbacks: any;
  feedback_selected: any;
  centerfeedback_arr: any = [];
  imagebase64: any;
  latlng: any={};
  selected_option: any = '';
  selected_options: any = [];

  check_status_picshare: boolean = false;
  check_status_locshare: boolean = false;
  check_status_feedback: boolean = false;
  status_picshare: string = 'Not Set';
  status_locshare: string = 'Not Set';

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private camera: Camera,
    private geolocation: Geolocation
  ) { }

  ngOnInit() {
    this.getFeedback();

  }

  async getFeedback() {
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallcenterfeedback()
      .subscribe(res => {
        console.log('@@@Feedback from db: '+JSON.stringify(res));
        loading.dismiss();
        this.feedbacks = res;
        //this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');         
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }
  
  /*onChange(selectedValue: any, feedback: any) {
    //console.log('@@@Selected value: ', selectedValue.detail.value);
    //console.log('@@@Selected feedback: ', JSON.stringify(feedback));
    let newfeed = {
      "_id" : feedback._id,
      "id" : feedback.id,
      "feedback_q": feedback.feedback,
      "feedback_a": selectedValue.detail.value
    }
    this.insertIntoArray(feedback._id, newfeed);
    
  }*/

  selectOnChange_single(feedback: any, answer: any){
    //console.log('@@@Selected value: ', answer);
    //console.log('@@@Selected feedback: ', JSON.stringify(feedback));
    let newfeed = {
      "_id" : feedback._id,
      "id" : feedback.id,
      "feedback_q": feedback.feedback,
      "feedback_a": answer
    }
    this.insertIntoArray(feedback._id, newfeed);
  }

  selectOnChange_multiple(feedback: any, answer: any){
    console.log('@@@Selected value: ', answer);
    console.log('@@@Selected feedback: ', JSON.stringify(feedback));
    let newfeed = {
      "_id" : feedback._id,
      "id" : feedback.id,
      "feedback_q": feedback.feedback,
      "feedback_a": answer
    }
    //this.insertIntoArray(feedback._id, newfeed);
  }

  insertIntoArray(_id, newfeed){
    let ele_found = false;
    let index = 0, i = 0;
    this.centerfeedback_arr.forEach(ele => {
      if(ele['_id'] == _id){
        ele_found = true;
        index = i;
        return;
      }
      i++;
    });

    if(ele_found){
      //console.log(' ele found');
      this.centerfeedback_arr.pop(index);
      this.centerfeedback_arr.push(newfeed);
    }else{
      //console.log(' ele not found');
      this.centerfeedback_arr.push(newfeed);
    }

    //console.log(' Arr: '+JSON.stringify(this.centerfeedback_arr));  createcenterfeedbackmgr
  }

  // Save all center feedback process starts from here
  async save(){
    if(!this.check_status_picshare){
      this.showAlert('Please check', 'Center image', 'No images shared yet !!!');
    }else if(!this.check_status_locshare){
      this.showAlert('Please check', 'Center location', 'No location shared yet !!!');
    }/*else if(!this.check_status_feedback){
      this.showAlert('Please check', 'Center feedback', 'Please check all feedbacks !!!');
    }*/else{
      if(this.centerfeedback_arr.length <= 0 || this.centerfeedback_arr.length < this.feedbacks.length){
        console.log(this.centerfeedback_arr.length +'    '+ this.feedbacks.length);
        this.showAlert('Center feedback', 'Center feedback', 'Please select all feedbacks !!!');
      }else{
        let body = {
          userid : localStorage.getItem("_userid"),
          username : localStorage.getItem("_username"),
          centerid : localStorage.getItem("_centerid"),
          centername : localStorage.getItem("_centername"),
          date : new Date(),
          centrefeedback : this.centerfeedback_arr,
          latlng : this.latlng,
          imageurl : '',
          contentType : 'image/jpeg',
          image : this.imagebase64
        }
        let loading = await this.loadingController.create({});
        await loading.present();
        await this.api.savedailyinfo(body)
          .subscribe(res => {
            console.log(res);
            loading.dismiss();
            this.showAlert('Center feedback', 'Center feedback', 'Center feedback saved '+res['status']+' !!!');
          }, err => {
            console.log(err);
            loading.dismiss();
          });
          this.navCtrl.navigateRoot('/center');
      }  
    }
  }
  
  async saveCenterfeedback(){
    if(this.centerfeedback_arr.length > 0){
      let body = {
        userid : localStorage.getItem("_userid"),
        username : localStorage.getItem("_username"),
        centerid : localStorage.getItem("_centerid"),
        centername : localStorage.getItem("_centername"),
        centrefeedback : this.centerfeedback_arr
      }
      let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.createcenterfeedbackmgr(body)
        .subscribe(res => {
          console.log(res);
          loading.dismiss();
          this.showAlert('Center feedback', 'Center feedback', 'Center feedback saved '+res['status']+' !!!');
        }, err => {
          console.log(err);
          loading.dismiss();
        });
        this.navCtrl.navigateRoot('/center');
    }else{
      this.showAlert('Center feedback', 'Center feedback', 'Please select some feedback !!!');
    }
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
       //this.savePictureasBase64(imageData);

       this.check_status_picshare = true;
       this.status_picshare = 'Ok';
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
         var obj = {lat: resp.coords.latitude, lng: resp.coords.longitude};
         this.latlng = obj;

         this.check_status_locshare = true;
         this.status_locshare = 'Ok';
         this.showAlert("Location", "Current location", "Latitude: "+resp.coords.latitude+"    <br>Longitude: "+resp.coords.longitude)
        /*
         let body = {
           userid : localStorage.getItem("_userid"),
           username : localStorage.getItem("_username"),
           centerid : localStorage.getItem("_centerid"),
           centername : localStorage.getItem("_centername"),
           latlng : {lat: resp.coords.latitude, lng: resp.coords.longitude}
         }
         this.showConfirm('Confirmation  !','', 'Do you want to share your current location?<br>latitude:<strong>'+resp.coords.latitude+'</strong>   longitude:<strong>'+resp.coords.longitude+'</strong>', body);
        */ 
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
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.savegeolocation(body);
          }
        }
      ]
    });
    await alert.present();
  }
}
