import { Component } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from './../../rest-api.service';
import { environment } from 'src/environments/environment.prod';

// to access sd card
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

// file system access
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

// video player
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';


@Component({
  selector: 'app-training2',
  templateUrl: './training2.page.html',
  styleUrls: ['./training2.page.scss']
})
export class Training2Page {
  baseUrl: string = environment.baseUrl+'getimage/';
  _userid: string;
  _username: string;

  res: any;
  _id: string = '';
  _moduleid: string = '';
  _modulename: string = '';
  _submoduleid: string = '';
  _submodulename: string = '';

  trainingobj: any = {};
  content: string = '';
  worksheet: any = [];
  video: any = [];
  image: any = [];
  quiz: any = [];

  sdcard_path: string = '';
  sdcard_filepath: string ='';
  doc_filepath_full: string ='';
  vid_filepath_full: string ='';
  

  isVisited_content: boolean = false;
  isVisited_video: boolean = false;
  isVisited_worksheet: boolean = false;
  isVisited_image: boolean = false;
  isVisited_quiz: boolean = false;

  
  isEnabled_completeActivityButton: boolean = false;
  isActivity_alreadySaved: boolean = false;





  qryParams: any;
  selected_program: string = '';
  selected_subject: string = '';
  selected_month: string = '';
  selected_week: string = '';
  selected_activity: string = '';


  

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
    public navParams: NavParams
  ) {
    // fetch sd-card
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

    // modal paramiters
    this.res = this.navParams.data.res;
    console.log('###this.res: ' + JSON.stringify(this.res));

    this._id = this.res.submodule._id;
    this._moduleid = this.res.submodule.moduleid;
    this._modulename = this.res.submodule.modulename;
    this._submoduleid = this.res.submodule.submoduleid;
    this._submodulename = this.res.submodule.submdulename;

    this.Enable_CompleteActivityButton();
    console.log('@@@moduleid: ' + this._moduleid+'    submoduleid: '+this._submoduleid);
    this.getalltrainingcontents(this._moduleid, this._submoduleid);
  }

  async getalltrainingcontents(moduleid, submoduleid){
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltrainingcontents(moduleid, submoduleid).subscribe(res => {
        if (res.length > 0) {
          this.trainingobj = res[0];
          this.content = this.trainingobj.content;
          this.worksheet = this.trainingobj.worksheet;
          this.video = this.trainingobj.video;
          this.image = this.trainingobj.flashcard;
          this.quiz = this.trainingobj.quiz;

          // mark scrollable content as visited
          this.isVisited_content = true;
          this.isVisited_image = true;
        } 
        console.log('@@@content: ' + JSON.stringify(this.content));
        console.log('@@@worksheet: ' + JSON.stringify(this.worksheet));
        console.log('@@@video: ' + JSON.stringify(this.video));
        console.log('@@@image: ' + JSON.stringify(this.image));
        console.log('@@@quiz: ' + JSON.stringify(this.quiz));
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }
  
  // play video button click
  async play_video(video_no){
    console.log('video no: '+video_no);
    this.vid_filepath_full = this.sdcard_filepath+'/THINKZONE/PGE/'+this.selected_subject.toLocaleUpperCase()+'/VIDEO/M'+this.selected_month+'_W'+this.selected_week+'_L'+this.selected_activity+'_'+video_no+'.mp4';
    // alert('### video file path: '+this.vid_filepath_full);
    let voption: VideoOptions = {
      volume: 0.5,
      scalingMode: 0.5
    };
    // alert(this.vid_filepath_full);
    this.videoPlayer.play(this.vid_filepath_full,voption).then(() => {
        //alert('Video completed !!!');
        this.isVisited_video = true;
        this.Enable_CompleteActivityButton();
      }).catch(e => {
        alert(JSON.stringify(e));
      });
  }

  // open document button click
  async open_document(){
    let filename = 'M'+this.selected_month+'_W'+this.selected_week+'_A'+this.selected_activity, 
    file_ext = 'pdf', 
    filename_new = Date.now(), 
    file_type = 'application/pdf';

    this.doc_filepath_full = this.sdcard_filepath+'/THINKZONE/PGE/'+this.selected_subject.toLocaleUpperCase()+'/WORKSHEET';
    // alert('### doc file path: '+this.doc_filepath_full);
    //this.showAlert('file.externalApplicationStorageDirectory','',''+this.file.externalApplicationStorageDirectory);
    // alert('source: '+this.doc_filepath_full+'    --    filenmae:  '+filename+'    --    destin: '+this.file.externalApplicationStorageDirectory+'/files');

    // copy file and show
    this.file.copyFile(this.doc_filepath_full, filename+'.'+file_ext, this.file.externalApplicationStorageDirectory+'/files', filename_new+'.'+file_ext).then(result => {
      this.fileOpener.open(result.nativeURL, file_type) 
        .then(() => {
          console.log('File is opened');
          this.isVisited_worksheet = true;
          this.Enable_CompleteActivityButton();
        }).catch(e => alert('Error opening file'+ JSON.stringify(e)));
    }).catch(e => alert('Error copying file'+ JSON.stringify(e)));
  }

  quiz_option_div_clicked(question, user_selected_option){
    console.log('@@@selcted: '+user_selected_option+'    question: '+ JSON.stringify(question.detail));
    
  }

  async complete_activity(){
    if(this.isActivity_alreadySaved){
      this.showAlert('Info','','Activity already Submitted !!!');
    }else{
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
      }
      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.savetchactivity(body).subscribe(res => {
          this.showAlert('Activity','','Activity save '+JSON.stringify(res.status));
          loading.dismiss();
        }, err => {
          console.log(err);
          loading.dismiss();
        });
    }
  }

  // for checking the specific activity is already saved by this user or not
  async getTchActivity(){
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.gettchactivitiydetails(this._userid, this.selected_program, this.selected_subject, this.selected_month, this.selected_week, this.selected_activity).subscribe(res => {
        if (res.length > 0) {
          this.isActivity_alreadySaved = true;
        }else{
          this.isActivity_alreadySaved = false;
        } 
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }
  
  Enable_CompleteActivityButton(){
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