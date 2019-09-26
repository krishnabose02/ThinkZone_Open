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

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

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

  user_selected_quiz_arr: any = [];
  score: number = 0;
  totalmark: number = 0;
  
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
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation
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
  async play_video(video_file){
    //alert('Now Orientation: '+this.screenOrientation.type); // logs the current orientation, example: 'landscape'

    // set to landscape
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    console.log('video_file: '+video_file);
    this.vid_filepath_full = this.sdcard_filepath+'/'+video_file;
    //alert('Selected video: '+this.vid_filepath_full);
    let voption: VideoOptions = {
      volume: 0.5, scalingMode: 2
    };
    // alert(this.vid_filepath_full);
    this.videoPlayer.play(this.vid_filepath_full,voption).then(() => {
        //alert('Video completed !!!');
        this.isVisited_video = true;
        this.Enable_CompleteActivityButton();

        // set to portrait
        //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      }).catch(e => {
        alert(JSON.stringify(e));
        // set to portrait
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      });
      // set to portrait
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  // open document button click
  async open_document(document_file){
    let n = document_file.lastIndexOf("/");
    let str1 = document_file.substring(0,n);
    let str2 = document_file.substring(n+1, document_file.length);
    console.log('@@@ document_file: '+document_file+'    str1: '+str1+'    str2: '+str2);

    let filename = str2, 
    file_ext = 'pdf', 
    filename_new = Date.now(), 
    file_type = 'application/pdf';

    this.doc_filepath_full = this.sdcard_filepath+'/'+str1;
    // alert('### doc file path: '+this.doc_filepath_full);
    //this.showAlert('file.externalApplicationStorageDirectory','',''+this.file.externalApplicationStorageDirectory);
    // alert('source: '+this.doc_filepath_full+'    --    filenmae:  '+filename+'    --    destin: '+this.file.externalApplicationStorageDirectory+'/files');

    // copy file and show
    this.file.copyFile(this.doc_filepath_full, filename, this.file.externalApplicationStorageDirectory+'/files', filename_new+'.'+file_ext).then(result => {
      this.fileOpener.open(result.nativeURL, file_type) 
        .then(() => {
          console.log('File is opened');
          this.isVisited_worksheet = true;
          this.Enable_CompleteActivityButton();
        }).catch(e => alert('Error opening file'+ JSON.stringify(e)));
    }).catch(e => alert('Error copying file'+ JSON.stringify(e)));
  }

  quiz_option_div_clicked(event, question){
    let user_selected_option = event.detail.value;
    //console.log('@@@8user selcted: '+user_selected_option+'    question: '+ JSON.stringify(question));
    let qid = question.qid;
    let qstn = question.question;
    let A = question.A;
    let B = question.B;
    let C= question.C;
    let D = question.D;
    let answer = question.answer;

    let qObj = {
      "qid": qid,
      "question": qstn,
      "A": A,
      "B":B,
      "C": C,
      "D": D,
      "answer": answer,
      "user_answer": user_selected_option
    }

    let selected_item_index = -1;
    let loop_index = 0;
    this.user_selected_quiz_arr.forEach(element => {
      if(element.qid == qid){
        selected_item_index = loop_index;
        return;
      }
      loop_index++;
    });
    if(selected_item_index < 0){ // push
      this.user_selected_quiz_arr.splice(0,0,qObj);
    }else{ // replace
      this.user_selected_quiz_arr.splice(selected_item_index,1,qObj);
    }
    console.log('@@@    user_selected_quiz_arr: '+ JSON.stringify(this.user_selected_quiz_arr));
  }

  calculate_score(){
    this.user_selected_quiz_arr.forEach(element => {
      if(element.answer == element.user_answer)
        this.score += 10;
      this.totalmark += 10;
    });
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