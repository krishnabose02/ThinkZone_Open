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

// to access sd card
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

// file system access
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';

// video player
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';

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
  sdcard_path: string = '';
  sdcard_filepath: string ='';
  filepath_full: string ='';
  doc_filepath_full: string ='';
  vid_filepath_full: string ='';

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
    private diagnostic: Diagnostic,
    private videoPlayer: VideoPlayer
  ) {
    this.diagnostic.requestExternalStorageAuthorization().then(val => {
      if(val){
        this.diagnostic.getExternalSdCardDetails().then(details => {
          this.sdcard_path = details[0].path;
          this.sdcard_filepath = details[0].filePath;
          this.showAlert('SDCARD DETAILS','',''+JSON.stringify(details[0]));
          this.filepath_full = this.sdcard_filepath+'/Thinkzone/ECD/M1_W1_A1.mp4';
        });
      }
    });
    
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

  // play video button click
  async play_video(){
    this.vid_filepath_full = this.filepath_full;
    let voption: VideoOptions = {
      volume: 0.5,
      scalingMode: 0.5
    };
    this.videoPlayer.play(this.vid_filepath_full,voption).then(() => {
      console.log('video completed');
      }).catch(err => {
      console.log(err);
      });
  }

  // open document button click
  async open_document(){
    //this.doc_filepath_full = this.sdcard_path+'/Thinkzone/DOCS/test.jpg';
    this.doc_filepath_full = this.sdcard_path+'/Thinkzone/DOCS';
    this.showAlert('doc_filepath_full','',''+this.doc_filepath_full);
    let fakeName = Date.now();
    this.file.copyFile(this.doc_filepath_full, 'test.pdf', this.file.dataDirectory, fakeName+'.pdf').then(result => {
      alert('@@result: '+JSON.stringify(result));
      this.fileOpener.open(result.nativeURL, 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch(e => alert('Error opening file'+ JSON.stringify(e)));
    })
    /*const options: DocumentViewerOptions = {
      title: 'My PDF'
    }
    this.document.viewDocument(this.doc_filepath_full, 'application/pdf', options);
    */
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