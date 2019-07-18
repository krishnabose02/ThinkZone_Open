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
  doc_filepath_full: string ='';
  vid_filepath_full: string ='';


  
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
          //this.showAlert('SDCARD DETAILS','',''+JSON.stringify(details[0]));
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
        this.qryParams.program, this.qryParams.subject, this.qryParams.month, this.qryParams.week, this.qryParams.activity
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

  // -------------------------------------------
  
  // play video button click
  async play_video(){
    this.vid_filepath_full = this.sdcard_filepath+'/THINKZONE/ECE/VIDEO/M1_W1_A1.mp4';;
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
    let filename = 'M1_W1_A1', file_ext = 'pdf', filename_new = Date.now(), file_type = '';
    if(file_ext == 'jpg' || file_ext == 'jpeg')       file_type = 'image/jpeg';
    else if(file_ext == 'png' || file_ext == 'apng')  file_type = 'image/png';
    else if(file_ext == 'gif')                        file_type = 'image/gif';
    else if(file_ext == 'bmp')                        file_type = 'image/bmp';
    else if(file_ext == 'svg' || file_ext == 'svgz')  file_type = 'image/svg+xml';
    else if(file_ext == 'tif' || file_ext == 'tiff')  file_type = 'image/tiff';
    else if(file_ext == 'pdf')                        file_type = 'application/pdf';
    else if(file_ext == 'txt')                        file_type = 'text/plain';
    else if(file_ext == 'csv')                        file_type = 'text/csv';
    else if(file_ext == 'htm' || file_ext == 'html')  file_type = 'text/html';
    else if(file_ext == 'doc')                        file_type = 'application/msword';
    else if(file_ext == 'docx')                       file_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if(file_ext == 'ppt')                        file_type = 'application/vnd.ms-powerpoint';
    else if(file_ext == 'pptx')                       file_type = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    else if(file_ext == 'xls')                        file_type = 'application/vnd.ms-excel';
    else if(file_ext == 'xlsx')                       file_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    else if(file_ext == 'odp')                        file_type = 'application/vnd.oasis.opendocument.presentation';
    else if(file_ext == 'ods')                        file_type = 'application/vnd.oasis.opendocument.spreadsheet';
    else if(file_ext == 'odt')                        file_type = 'application/vnd.oasis.opendocument.text';

    this.doc_filepath_full = this.sdcard_filepath+'/THINKZONE/ECE/WORKSHEET';
    this.showAlert('file.externalApplicationStorageDirectory','',''+this.file.externalApplicationStorageDirectory);

    // copy file and show
    this.file.copyFile(this.doc_filepath_full, filename+'.'+file_ext, this.file.externalApplicationStorageDirectory+'/files', filename_new+'.'+file_ext).then(result => {
      this.fileOpener.open(result.nativeURL, file_type) 
        .then(() => {
          console.log('File is opened');
        }).catch(e => alert('Error opening file'+ JSON.stringify(e)));
    }).catch(e => alert('Error copying file'+ JSON.stringify(e)));
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