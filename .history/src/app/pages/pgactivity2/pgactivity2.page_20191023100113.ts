import { Component } from '@angular/core';
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

// to access sd card
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

// file system access
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

// video player
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { DataService, DataObject } from 'src/app/services/data.service';

@Component({
  selector: 'app-pgactivity2',
  templateUrl: './pgactivity2.page.html',
  styleUrls: ['./pgactivity2.page.scss']
})
export class Pgactivity2Page {
  qryParams: any;
  activityobj: any = {};
  content = '';
  worksheet: any = [];
  video: any = [];

  sdcard_path = '';
  sdcard_filepath = '';
  doc_filepath_full = '';
  vid_filepath_full = '';

  selected_program = '';
  selected_subject = '';
  selected_month = '';
  selected_week = '';
  selected_activity = '';

  isVisited_content = false;
  isVisited_video = false;
  isVisited_worksheet = false;
  isEnabled_completeActivityButton = false;
  isActivity_alreadySaved = false;

  full_video_path_list: DataObject[];
  full_sheet_path_list: DataObject[];

  _userid: string;
  _username: string;

  preferedlanguage: string = localStorage.getItem("_language");
  
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
    private file: File,
    private fileOpener: FileOpener,
    private diagnostic: Diagnostic,
    private videoPlayer: VideoPlayer,
    private dataService: DataService
  ) {
    // fetch sd-card
    this.diagnostic.requestExternalStorageAuthorization().then(val => {
      if (val) {
        this.diagnostic.getExternalSdCardDetails().then(details => {
          this.sdcard_path = details[0].path;
          this.sdcard_filepath = details[0].filePath;
          // this.showAlert('SDCARD DETAILS','',''+JSON.stringify(details[0]));
        });
      }
    });

    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');

    // query params
    this.route.queryParams.subscribe(params => {
      // console.log('@@@params: ' + JSON.stringify(params));
      if (params && params.paramiters) {
        this.qryParams = JSON.parse(params.paramiters);
        // console.log('@@@qryParams1: ' + JSON.stringify(this.qryParams));
        this.selected_program = this.qryParams.program;
        this.selected_subject =  this.qryParams.subject;
        this.selected_month = this.qryParams.month;
        this.selected_week = this.qryParams.week;
        this.selected_activity = this.qryParams.activity;
        this.getmasteractivitiydetails(this.selected_program,
                                      this.selected_subject,
                                      this.selected_month,
                                      this.selected_week,
                                      this.selected_activity);
      }
    });
    // console.log('@@@qryParams2: ' + JSON.stringify(this.qryParams));

    this.Enable_CompleteActivityButton();
    this.getTchActivity();
  }

  // getmasteractivitiydetails
  async getmasteractivitiydetails(program, subject, month, week, activity) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getmasteractivitiydetails(program, subject, month, week, activity).subscribe(res => {
        if (res.length > 0) {
          this.activityobj = res[0];
          this.content = this.activityobj.content;
          this.worksheet = this.activityobj.worksheet;
          this.video = this.activityobj.video;
          this.fillVideoPathNames(this.activityobj.video);
          this.fillSheetPathNames(this.activityobj.worksheet);
          // mark scrollable content as visited
          this.isVisited_content = true;
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

  fillVideoPathNames(names: string[]) {
    this.full_video_path_list = [];
    for (let i = 1; i <= names.length; i++) {
      this.full_video_path_list.push({
        path: this.sdcard_filepath
        + '/THINKZONE/PGE/'
        + this.selected_subject.toLocaleUpperCase()
        + '/VIDEO/M'
        + this.selected_month
        + '_W'
        + this.selected_week
        + '_L'
        + this.selected_activity
        + '_'
        + i
        + '.mp4',
        played: false});
    }
  }

  fillSheetPathNames(names: string[]) {
    const p = this.sdcard_filepath + '/THINKZONE/PGE/' + this.selected_subject.toLocaleUpperCase() + '/WORKSHEET';

    this.full_sheet_path_list = [];
    for (let i = 1; i <= names.length; i++) {
      this.full_sheet_path_list.push(
        {
          path: p,
          file_name: 'M' + this.selected_month + '_W' + this.selected_week + '_A' + this.selected_activity + '_' + i + '.pdf',
          played: false
    });
    }
  }
  // -------------------------------------------

  // play video button click
  async play_video() {
    console.log(this.full_video_path_list);

    this.dataService.setDocumentData(this.full_video_path_list);
    this.dataService.setData('type', 'video');
    this.dataService.setData('page_title', 'Videos');
    this.navController.navigateForward('/file-display');
    // console.log('video no: ' + video_no);
    // this.vid_filepath_full =  this.sdcard_filepath
    //                           + '/THINKZONE/PGE/'
    //                           + this.selected_subject.toLocaleUpperCase()
    //                           + '/VIDEO/M'
    //                           + this.selected_month
    //                           + '_W'
    //                           + this.selected_week
    //                           + '_L'
    //                           + this.selected_activity
    //                           + '_'
    //                           + video_no
    //                           + '.mp4';
    // // alert('### video file path: '+this.vid_filepath_full);
    // const voption: VideoOptions = {
    //   volume: 0.5,
    //   scalingMode: 0.5
    // };
    // // alert(this.vid_filepath_full);
    // this.videoPlayer.play(this.vid_filepath_full, voption).then(() => {
    //     // alert('Video completed !!!');
    //     this.isVisited_video = true;
    //     this.Enable_CompleteActivityButton();
    //   }).catch(e => {
    //     alert(JSON.stringify(e));
    //   });
  }

  // open document button click
  async open_document() {
    console.log(this.full_sheet_path_list);

    this.dataService.setDocumentData(this.full_sheet_path_list);
    this.dataService.setData('type', 'document');
    this.dataService.setData('page_title', 'Worksheets');
    this.navController.navigateForward('/file-display');
    // const filename = 'M' + this.selected_month + '_W' + this.selected_week + '_A' + this.selected_activity,
    // file_ext = 'pdf',
    // filename_new = Date.now(),
    // file_type = 'application/pdf';

    // this.doc_filepath_full = this.sdcard_filepath + '/THINKZONE/PGE/' + this.selected_subject.toLocaleUpperCase() + '/WORKSHEET';

    // // copy file and show
    // this.file.copyFile( this.doc_filepath_full, filename + '.' + file_ext,
    //                     this.file.externalApplicationStorageDirectory + '/files',
    //                     filename_new + '.' + file_ext).then(result => {
    //   this.fileOpener.open(result.nativeURL, file_type)
    //     .then(() => {
    //       console.log('File is opened');
    //       this.isVisited_worksheet = true;
    //       this.Enable_CompleteActivityButton();
    //     }).catch(e => alert('Error opening file' + JSON.stringify(e)));
    // }).catch(e => alert('Error copying file' + JSON.stringify(e)));
  }

  async complete_activity() {
    if (this.isActivity_alreadySaved) {
      this.showAlert('Info', '', 'Activity already Submitted !!!');
    } else {
      const body = {
        userid : this._userid,
        username : this._username,
        program: this.selected_program,
        subject: this.selected_subject,
        month: this.selected_month,
        week: this.selected_week,
        activity: this.selected_activity,
        content: '',
        content_status : true,
        worksheet: '',
        worksheet_status : true,
        video: '',
        video_status : true
      };
      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.savetchactivity(body).subscribe(res => {
          this.showAlert('Activity', '', 'Activity save ' + JSON.stringify(res.status));
          loading.dismiss();
        }, err => {
          console.log(err);
          loading.dismiss();
        });
    }
  }

  // for checking the specific activity is already saved by this user or not
  async getTchActivity() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.gettchactivitiydetails(this._userid,
                                          this.selected_program,
                                          this.selected_subject,
                                          this.selected_month,
                                          this.selected_week,
                                          this.selected_activity).subscribe(res => {
        if (res.length > 0) {
          this.isActivity_alreadySaved = true;
        } else {
          this.isActivity_alreadySaved = false;
        }
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  Enable_CompleteActivityButton() {
    this.isEnabled_completeActivityButton = (this.isVisited_content && this.isVisited_video && this.isVisited_worksheet) ? true : false ;
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
