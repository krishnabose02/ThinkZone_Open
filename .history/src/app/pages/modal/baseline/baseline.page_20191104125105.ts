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
  _id = '';
  userid = '';
  username = '';
  centerid = '';
  centername = '';
  studentid = '';
  studentname = '';
  program = '';
  class = '';
  phone = '';
  gender = '';
  dob = '';
  parentsname = '';
  level = '';
  createdon = '';

  baseline_q: any = [];
  subject = '';
  lvl = '';

  _maindata: any = [];
  _questionset: any = [];
  score = 0;
  totalmark = 0;

  preferedlanguage: string = localStorage.getItem('_language');
  hide_info_div = true;
  hide_cont_div = false;

  answerList: any = {};

  @Input() value: any;
  constructor(
    private modalController: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public api: RestApiService,
    public navParams: NavParams
  ) {
    // console.log('@@@Local Storage: '+JSON.stringify(localStorage));
    this.hide_info_div = true;
    this.hide_cont_div = true;
  }

  ngOnInit() {
    this.res = this.navParams.data.res;
    this._id = this.res._id;
    this.studentname = this.res.studentname;
    this.program = this.res.program;
    this.class = this.res.class;

    this.subject = this.navParams.data.subject;
    this.lvl = this.navParams.data.selected_level;
    console.table('@#@#res: ' + JSON.stringify(this.res));
    console.table('@#@#subject: ' + JSON.stringify(this.subject));
    console.table('@#@#level: ' + JSON.stringify(this.lvl));
    this.subject = (this.subject == '' ||this.subject == null || this.subject == undefined) ? 'na' : this.subject ;
    this.getData();
  }

  closeModal() {
    this.modalController.dismiss({data: 'Cancel'});
  }

  async getData() {
    const data = {
      preferedlanguage: this.preferedlanguage,
      program: this.program,
      level: this.lvl,
      subject: this.subject
    };
    console.log('@@@filtering data: ' + JSON.stringify(data));
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getbaselinetestquestionset(data)
      .subscribe(res => {
        console.log('@@@Baseline from db: ' + JSON.stringify(res));
        loading.dismiss();
        this.baseline_q = res;

        if (this.baseline_q.length <= 0) {
          this.hide_info_div = false;
          this.hide_cont_div = true;
        } else {
          this.hide_info_div = true;
          this.hide_cont_div = false;
        }
        // this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  select_answer_onchange(value, selected_question) {
    this.answerList[selected_question.id] = value;
    const qid = selected_question.id;
    const question = selected_question.question;
    const user_answer = value;

    const qset = {
      qid : qid,
      question : question,
      useranswer : user_answer
    };

    // if questionset array is empty
    if (this._questionset.length <= 0) {
      this._questionset.push(qset);
    } else {
      let i = 0;
      let existing_index = -1;

      // check that question is already exist or not
      this._questionset.forEach(element => {
        console.log('###element: ' + JSON.stringify(element));
        if (element.qid === qid) {
          existing_index = i;
          return;
        }
        i++;
      });
      // if that question is exist
      if (existing_index >= 0) {
        this._questionset.splice(existing_index, 1, qset);
      } else {
        this._questionset.push(qset);
      }
    }
    console.log('###_questionset: ' + JSON.stringify(this._questionset));
  }

  calculate_totalscore() {
    let i = 0;
    this._questionset.forEach(element => {
      console.log('###useranswer: ' + element.useranswer + '    answer: ' + element.answer);
      if (element.useranswer === element.answer) {
        this.score += 1;
      } else {
        // this.score -= 1;
      }
      i++;
    });
    this.totalmark = i;
    console.log('###score: ' + this.score + '    totalmark: ' + this.totalmark);
  }

  async setLevel() {
    console.log('--> inside setlevel()');
    if (this._questionset.length <= 0) {
      this.showAlert('Info', '', 'Please enter all baseline tests.');
    } else {
      this.calculate_totalscore();
      const data = {
        detailsid: this._id,
        level: this.lvl,
        baselinetest: this._questionset,
        baselinetestresult: this.score
      };
      console.log('--> data: '+JSON.stringify(data));
      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.setlevelbyid(data)
        .subscribe(res => {
          console.log('@@@Baseline from db: ' + JSON.stringify(res));
          this.updateLevelInStudentDetail();
          loading.dismiss();
          this.showAlert('Set Level', '', 'Student level set ' + res['status'] + ' !!!');
          this.modalController.dismiss({data: 'Ok'});
        }, err => {
          console.log(err);
          loading.dismiss();
        });
    }
  }

  async updateLevelInStudentDetail() {
    console.log('--> inside updateLevelInStudentDetail()');
    const id = this._id;
    let data: any;
    if (this.subject === '' || this.subject === 'na') {
      data = { ec_level : this.lvl };
    } else if (this.subject === 'math') {
      data = { math_level : this.lvl };
    } else if (this.subject === 'english') {
      data = { eng_level : this.lvl };
    } else if (this.subject === 'odia') {
      data = { odia_level : this.lvl };
    }
    console.log('@@@Subject: ' + this.subject + '    data: ' + JSON.stringify(data));
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.updatelevelbyid(id, data)
      .subscribe(res => {
        console.log('@@@Update student details level: ' + JSON.stringify(res));
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
