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
  selector: 'app-makepayment',
  templateUrl: './makepayment.page.html',
  styleUrls: ['./makepayment.page.scss']
})
export class MakepaymentPage {
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

  month_diff: number;
  registration_date: string = '';

  is_first_transaction: boolean = true;
  pay_amount: string= '0';

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
    this.registration_date = this.res.registration_date;

    this.calculatemonth(new Date(this.registration_date));
  }

  // month difference
  calculatemonth(d1){     // old date 
    var d2 = new Date();  // new date
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    months = (d2.getDate() >= d1.getDate()) ? months += 1 : months;
    months = months <= 0 ? 0 : months;
    this.month_diff = months;
    console.log('@@@d2 Year: ' + d2.getFullYear()+'    d1 Year: ' + d1.getFullYear());
    console.log('@@@d2 Month: ' + d2.getMonth()+'    d1 Month: ' + d1.getMonth());
    console.log('@@@d2 Date: ' + d2.getDate()+'    d1 Date: ' + d1.getDate());

    console.log('@@@month_diff: ' + this.month_diff);
  }

  // amount type on change
  amount_type_onchange(amount_type){
    console.log('@@@amount_type: ' + amount_type+'    program: '+this.program);
    if(this.program == 'ece'){
      if(amount_type == 'annually') this.pay_amount = '600';
      else if(amount_type == 'semi-annually') this.pay_amount = '350';
      else if(amount_type == 'monthly') this.pay_amount = '100';
      else this.pay_amount = '0';
    }
    else if(this.program == 'pge'){
      if(amount_type == 'annually') this.pay_amount = '800';
      else if(amount_type == 'semi-annually') this.pay_amount = '450';
      else if(amount_type == 'monthly') this.pay_amount = '120';
      else this.pay_amount = '0';
    }
    else{
      this.pay_amount = '0';
    }
    
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
