import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  NavParams } from '@ionic/angular';

// Modals
import { RestApiService } from './../../../rest-api.service';


@Component({
  selector: 'app-eceassessmentmodal',
  templateUrl: './eceassessmentmodal.page.html',
  styleUrls: ['./eceassessmentmodal.page.scss']
})
export class EceassessmentmodalPage {
  assessment_list: any = [];
  public makepaymentFormGroup: FormGroup;
  amount: string = '';
  remark: string = '';

  res: any;
  userid: string;
  username: string;
  centerid: string;
  centername: string;
  studentid: string;
  studentname: string;
  program: string = '';
  class: string = '';

  constructor(
    private formBuilder: FormBuilder,
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    public navParams: NavParams
  ) {
    this.makepaymentFormGroup = this.formBuilder.group({
      amount: ['', [Validators.required]],
      remark: ['', [Validators.required]]
    });
    
    // modal paramiters
    this.res = this.navParams.data.res;
    console.log('###this.res: ' + JSON.stringify(this.res));

    this.userid = this.res.userid;
    this.username = this.res.username;
    this.centerid = '';
    this.centername = '';
    this.studentid = this.res.studentid;
    this.studentname = this.res.studentname;
    this.program = this.res.program;
    this.class = this.res.class;
  }

  // get tch assessment
  async gettchassessment() {
    const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.gettchassessment(program, clas, stage)
        .subscribe(res => {
          // console.log('@@@all student list: ' + JSON.stringify(res));
          this.assessment_list = res;
          loading.dismiss();
        }, err => {
          console.log(err);
          loading.dismiss();
        });
  }

  
  // save attendance
  async makepayment(){
    this.amount = this.makepaymentFormGroup.value.amount;
    this.remark = this.makepaymentFormGroup.value.remark;
    const data = {
      userid : this.userid,
      username : this.username,
      centerid : this.centerid,
      centername : this.centername,
      studentid : this.studentid, 
      studentname : this.studentname,
      program: this.program,
      class : this.class,
      amount : this.amount,
      remark : this.remark 
    };
    this.save(data);
  }

  async save(data) {
    const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.savetchpaymentdetails(data)
        .subscribe(res => {
          // console.log('@@@all student list: ' + JSON.stringify(res));
          this.showAlert('Info','','Payment '+res['status']+' !!!');
          loading.dismiss();
          this.modalController.dismiss({data: 'Ok'});
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
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }
  
  // close modal
  closeModal() {
    this.modalController.dismiss({data: 'Cancel'});
  }
}
