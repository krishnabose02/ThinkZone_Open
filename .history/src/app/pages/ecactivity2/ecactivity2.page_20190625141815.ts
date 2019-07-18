import { Component, NgZone } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from './../../rest-api.service';
import { PgeengassessmentmodalPage } from './../modal/pgeengassessmentmodal/pgeengassessmentmodal.page';
import { PgemathassessmentmodalPage } from './../modal/pgemathassessmentmodal/pgemathassessmentmodal.page';

// file system access
import { File } from '@ionic-native/file/ngx';
// file opener
import { FileOpener } from '@ionic-native/file-opener/ngx';
// document viewer
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';

import { Diagnostic } from '@ionic-native/diagnostic/ngx';


@Component({
  selector: 'app-ecactivity2',
  templateUrl: './ecactivity2.page.html',
  styleUrls: ['./ecactivity2.page.scss']
})
export class Ecactivity2Page {
  qryParams: any;
  activityobj: any = {};
  content: string = '';
  worksheet: string = '';
  video: string = '';

  program: string = 'ece';
  subject: string = 'na';
  month_list: any = [];
  week_list: any = [];
  activity_list: any = [];
  selected_month: string = '';
  selected_week: string = '';
  activity_heading: string ='';

  month_diff: number;
  userreg_date: string = '';
  
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
    private loadingController: LoadingController,
    private route: ActivatedRoute, 
    private router: Router,
    private file: File,
    private fileOpener: FileOpener,
    private document: DocumentViewer,
    private diagnostic: Diagnostic
  ) {
    this.diagnostic.getExternalSdCardDetails().then(details => {
      this.showAlert('xxxxxxxx','','xxxxxxxx: '+JSON.stringify(details));
      /*details.forEach(function(detail){
          if(detail.type == "application"){
              cordova.file.externalSdCardApplicationDirectory = detail.filePath;
          }else if(detail.type == "root"){
              cordova.file.externalSdCardRootDirectory = detail.filePath;
          }
      });*/
    }, error => {
        console.error(error);
    });
    /*cordova.plugins.diagnostic.getExternalSdCardDetails(details => {
      this.showAlert('xxxxxxxx','','xxxxxxxx: '+JSON.stringify(details));
      console.log('xxxxxxxx','','xxxxxxxx: '+JSON.stringify(details));
    }, function(error){
        console.error(error);
    });


    this.diagnostic.getExternalSdCardDetails().then(obj => {
      this.showAlert('xxxxxxxx','','xxxxxxxx: '+JSON.stringify(obj));
    }, (errData)=>{
      
    });

    
    let path = this.file.externalRootDirectory;
    this.file.checkDir(path, 'mydir').then(_ => {
      console.log('Directory exists');
      this.showAlert('Directory exists','','Directory exists: '+path);
    }).catch(err =>{
      console.log('Directory doesnt exists');
      this.showAlert('Directory doesnt exists','','Directory doesnt exists: '+path);
    });

    
    // open pdf file
    //1. 
    //window.open(encodeURI('assets/sample.pdf'), '_system');

    //2. 
    const options: DocumentViewerOptions = {
      title: 'My PDF'
    }
    this.document.viewDocument('assets/sample.pdf', 'application/pdf', options)
    
  this.fileOpener.open('assets/sample.pdf', 'application/pdf')
    .then(() => console.log('File is opened'))
    .catch(e => console.log('Error opening file', e));

  this.fileOpener.showOpenWithDialog('assets/sample.pdf', 'application/pdf')
    .then(() => console.log('File is opened'))
    .catch(e => console.log('Error opening file', e));
  */

    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
    this._centerid = '';
    this._centername = '';

    //this.getuserbyid(this._userid);

    // query params
    this.route.queryParams.subscribe(params => {
      // console.log('@@@params: ' + JSON.stringify(params));
      if (params && params.paramiters) {
        this.qryParams = JSON.parse(params.paramiters);
        console.log('@@@qryParams1: ' + JSON.stringify(this.qryParams));
        this.getmasteractivitiydetails(this.qryParams.program, this.qryParams.subject, this.qryParams.month, this.qryParams.week, this.qryParams.activity);
      }
    });
    // console.log('@@@qryParams2: ' + JSON.stringify(this.qryParams));
  }

  // getmasteractivitiydetails
  async getmasteractivitiydetails(program, subject, month, week, activity){
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getmasteractivitiydetails(program, subject, month, week, activity).subscribe(res => {
        if (res.length > 0) {
          this.activityobj = res[0];
          this.content = this.activityobj.content;
          this.worksheet = this.activityobj.worksheet;
          this.video = this.activityobj.video;
        } 
        console.log('@@@content: ' + JSON.stringify(this.content));
        console.log('@@@worksheet: ' + JSON.stringify(this.worksheet));
        console.log('@@@video: ' + JSON.stringify(this.video));
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
          this.activityobj = res[0];
          this.userreg_date = res[0].createdon;
        } 
        //console.log('@@@userobj: ' + JSON.stringify(this.userobj));
        //console.log('@@@userreg_date: ' + this.userreg_date);
        this.calculatemonth(new Date(this.userreg_date), new Date());
        //this.calculatemonth(new Date(2018,11,11), new Date(2019,5,7));
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  calculatemonth(fromDate, toDate){
    // month difference
    let months = (toDate.getMonth() - fromDate.getMonth()) + (12 * (toDate.getFullYear() - fromDate.getFullYear())) + 1;
    if(toDate.getDate() < fromDate.getDate()){
        months--;
    }
    this.month_diff = months;
    //console.log('@@@month_diff: ' + this.month_diff);

    // make mont_diff a +ve number
    this.month_diff = (this.month_diff < 0) ? (this.month_diff * -1) : this.month_diff;
    let obj = {};
    this.month_list = [];
    for (let i = 1; i <= 12; i++) {
      if( i <= this.month_diff){
        obj = { value: ''+i, text: 'Month '+i, disabled: false};
      }else{
        obj = { value: ''+i, text: 'Month '+i, disabled: true};
      }
     
      this.month_list.push(obj);
    }
    //console.log('@@@month_list: ' + JSON.stringify(this.month_list));
  }
  
  // month on change event
  month_onchange(value){
    //console.log('@@@selected_month: '+value);
    this.selected_month = value;
    let obj = {};
    this.week_list = [];
    for (let i = 1; i <= 4; i++) {
      obj = { value: ''+i, text: 'Week '+i};
      this.week_list.push(obj);
    }

    // set activity heading
    if(this.selected_month.trim().length > 0 && this.selected_week.trim().length > 0){
      this.getactivitydetails(this.selected_month,this.selected_week);
    }
  }

  week_onchange(value){
    //console.log('@@@selected_week: '+value);
    this.selected_week = value;

    // set activity heading
    if(this.selected_month.trim().length > 0 && this.selected_week.trim().length > 0){
      this.getactivitydetails(this.selected_month,this.selected_week);
    }
  }

  async getactivitydetails(month, week){
    this.selected_month = month;
    this.selected_week = week;
    this.activity_heading = 'Month('+this.selected_month+') - Week('+this.selected_week+')';

    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getmasteractivities(this.program, this.subject, this.selected_month, this.selected_week).subscribe(res => {
        this.activity_list = res;
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  // ece fillmarks button click
  async activity_btnclick(activity){
    // navigate forward with params
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