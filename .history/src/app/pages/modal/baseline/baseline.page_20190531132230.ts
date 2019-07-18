import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController, LoadingController, AlertController, NavParams } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { RestApiService } from './../../../rest-api.service';

@Component({
  selector: 'app-baseline',
  templateUrl: './baseline.page.html',
  styleUrls: ['./baseline.page.scss'],
})
export class BaselinePage implements OnInit {
  res: any;
  _id: string = '';
  userid: string = '';
  username: string = '';
  centerid: string = '';
  centername: string = '';
  studentid: string = '';
  studentname: string = '';
  program: string = '';
  class: string = '';
  phone: string = '';
  gender: string = '';
  dob: string = '';
  parentsname: string = '';
  level: string = '';
  createdon: string = '';

  baseline_q: any = [];
  subject: string = '';
  lvl: string = '';

  _maindata: any = [];
  _questionset: any = [];
  score: number = 0;
  totalmark: number = 0;

  @Input() value: any;
  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public api: RestApiService,
    public navParams: NavParams
  ) {}

  ngOnInit() {
    this.res = this.navParams.data.res;
    this._id = this.res._id;
    this.program = this.res.program;
    this.class = this.res.class;

    this.subject = this.navParams.data.subject;
    this.lvl = this.navParams.data.selected_level;
    console.table('@#@#res: '+JSON.stringify(this.res));
    console.table('@#@#subject: '+JSON.stringify(this.subject));
    console.table('@#@#level: '+JSON.stringify(this.lvl));
    this.getData();
  }

  closeModal() {
    this.modalController.dismiss({data: 'Ok'});
  }

  async getData() {
    const data = {
      program: this.program,
      class: this.class,
      subject: this.subject,
      level: this.lvl
    };
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getbaselinetestquestionset(data)
      .subscribe(res => {
        console.log('@@@Baseline from db: '+JSON.stringify(res));
        loading.dismiss();
        this.baseline_q = res;
        // this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  select_answer_onchange(value, selected_question){
    let qid = selected_question.qid;
    let question = selected_question.question;
    let real_answer = selected_question.answer;
    let user_answer = value;

    const qset = {
      qid : qid,
      question : question,
      answer : real_answer,
      useranswer : user_answer
    };

    // if questionset array is empty
    if(this._questionset.length <= 0){
      this._questionset.push(qset);
    } 
    // if questionset array is not empty
    else {
      let i = 0;
      let existing_index = -1;

      // check that question is already exist or not
      this._questionset.forEach(element => {
        console.log('###element: '+JSON.stringify(element));
        if(element.qid == qid){
          existing_index = i;
          return;
        }
        i++;
      });
      // if that question is exist
      if(existing_index >= 0){
        this._questionset.splice(existing_index,1,qset);
      }
      // if that question is not exist
      else {
        this._questionset.push(qset);
      } 
    }
    console.log('###_questionset: '+JSON.stringify(this._questionset));
  }

  calculate_totalscore(){
    let i = 0;
    this._questionset.forEach(element => {
      console.log('###useranswer: '+element.useranswer+'    answer: '+element.answer);
      if(element.useranswer == element.answer){
        this.score += 1;
      } else {
        // this.score -= 1;
      }
      i++;
    });
    this.totalmark = i;
    console.log('###score: '+this.score+'    totalmark: '+this.totalmark);
  }

  async setLevel(){
    this.calculate_totalscore();
    const data = {
      detailsid: this._id,
      level: this.lvl,
      baselinetest: this._questionset,
      baselinetestresult: this.score
    };
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.setlevelbyid(data)
      .subscribe(res => {
        console.log('@@@Baseline from db: '+JSON.stringify(res));
        loading.dismiss();
        this.showAlert('Set Level', '', 'Student level set '+res['status']+' !!!');
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  async updateLevelInStudentDetail(){
    const id = this._id;
    let data: any;
    if(this.subject == ''){
      data = { ec_level : this.lvl };
    } else if(this.subject == 'math'){
      data = { math_level : this.lvl };
    } else if(this.subject == 'english'){
      data = { eng_level : this.lvl };
    } else if(this.subject == 'odia'){
      data = { odia_level : this.lvl };
    }
    console.log('@@@Subject: '+this.subject+'    data: '+JSON.stringify(data));
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.updatelevelbyid(id, data)
      .subscribe(res => {
        console.log('@@@Update student details level: '+JSON.stringify(res));
        loading.dismiss();
        // this.showAlert('Set Level', '', 'Student level set '+res['status']+' !!!');
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
}
