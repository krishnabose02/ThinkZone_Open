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
  // fee structure
  fee_ece_annually = '600';
  fee_ece_semiannually = '350';
  fee_ece_monthly = '100';
  fee_pge_annually = '800';
  fee_pge_semiannually = '450';
  fee_pge_monthly = '120';
  modes = [{value: 'annually', text: 'Annually'}, {value: 'semi-annually', text: 'Semi Annually'}, {value: 'monthly', text: 'Monthly'}];

  total_payable_amount = 0;
  total_paid_amount = 0;
  total_pending_amount = 0;

  public makepaymentFormGroup: FormGroup;
  amount = '';
  remark = '';

  res: any;
  userid: string;
  username: string;
  centerid: string;
  centername: string;
  studentid: string;
  studentname: string;
  program = '';
  class = '';

  payment_type = '';
  month_diff: number;
  registration_date = '';
  running_month = 0;
  regdt = '';

  is_first_transaction = true;
  pay_amount = '0';

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
    this.regdt = new Date(this.registration_date).toDateString();

    this.getalltchpaymentdetailsbystudentid(this.studentid);
  }

  // get all transactions
  async getalltchpaymentdetailsbystudentid(sid) {
    const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.getalltchpaymentdetailsbystudentid(sid)
        .subscribe(res => {
          console.log('@@@all payment transactions: ' + JSON.stringify(res));
          if (res.length > 0) {
            res.forEach(element => {
              this.total_paid_amount += parseInt(element.amount);
            });

            this.is_first_transaction = false;
            const ptype = res[0]['payment_type'];
            this.amount_type_onchange(ptype);
            this.payment_type = ptype;

            console.log('@@@this.running_month: ' + this.running_month + '    this.pay_amount: ' + this.pay_amount);
            if (this.payment_type === 'annually' && this.running_month <= 12) {
              this.total_payable_amount = 1 * parseInt(this.pay_amount);
            } else if (this.payment_type === 'semi-annually' && this.running_month <= 6) {
              this.total_payable_amount = 1 * parseInt(this.pay_amount);
            } else if (this.payment_type === 'semi-annually' && this.running_month > 6) {
              this.total_payable_amount = 2 * parseInt(this.pay_amount);
            } else if (this.payment_type === 'monthly') {
              this.total_payable_amount = (this.running_month) * parseInt(this.pay_amount);
            }

            this.total_pending_amount = this.total_payable_amount - this.total_paid_amount;
            console.log('@@@ paid: ' + this.total_paid_amount + '    payble: ' + this.total_payable_amount + '    pending: ' + this.total_pending_amount);
          } else {
            this.is_first_transaction = true;
            this.payment_type = '';
          }
          loading.dismiss();
        }, err => {
          console.log(err);
          loading.dismiss();
        });
  }

  // month difference
  calculatemonth(d1) {     // old date
    const d2 = new Date();  // new date
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    months = (d2.getDate() >= d1.getDate()) ? months += 1 : months;
    months = months <= 0 ? 0 : months;
    this.month_diff = months;
    console.log('@@@d2 Year: ' + d2.getFullYear() + '    d1 Year: ' + d1.getFullYear());
    console.log('@@@d2 Month: ' + d2.getMonth() + '    d1 Month: ' + d1.getMonth());
    console.log('@@@d2 Date: ' + d2.getDate() + '    d1 Date: ' + d1.getDate());

    console.log('@@@month_diff: ' + this.month_diff);
    this.running_month = this.month_diff + 1;
  }

  // amount type on change
  amount_type_onchange(amount_type) {
    console.log('@@@amount_type: ' + amount_type + '    program: ' + this.program);
    this.payment_type = amount_type;
    if (this.program === 'ece') {
      if (amount_type === 'annually') { this.pay_amount = this.fee_ece_annually; } else if (amount_type === 'semi-annually') { this.pay_amount = this.fee_ece_semiannually; } else if (amount_type === 'monthly') { this.pay_amount = this.fee_ece_monthly; } else { this.pay_amount = '0'; }
    } else if (this.program === 'pge') {
      if (amount_type === 'annually') { this.pay_amount = this.fee_pge_annually; } else if (amount_type === 'semi-annually') { this.pay_amount = this.fee_pge_semiannually; } else if (amount_type === 'monthly') { this.pay_amount = this.fee_pge_monthly; } else { this.pay_amount = '0'; }
    } else {
      this.pay_amount = '0';
    }
  }

  // save attendance
  async makepayment() {
    if (this.total_payable_amount > 0 && this.total_paid_amount > 0 && (this.total_payable_amount - this.total_paid_amount) <= 0) {
      alert('All dues are cleared for this month !!!');
    } else if (this.payment_type === undefined || this.payment_type == null || this.payment_type === '') {
      alert('Please select the payment type !!!');
    } else if (this.pay_amount === undefined || this.pay_amount == null || this.pay_amount === '') {
      alert('Invalid payment amount !!!');
    } else {
      this.showConfirm('Confirmation', '', 'Do you want to proceed?');
    }
  }

  async save(data) {
    const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.savetchpaymentdetails(data)
        .subscribe(res => {
          // console.log('@@@all student list: ' + JSON.stringify(res));
          this.showAlert('Info', '', 'Payment ' + res['status'] + ' !!!');
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
  async showConfirm(header: string, subHeader: string, message: string) {
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
          handler: () => {
            const data = {
              userid : this.userid,
              username : this.username,
              studentid : this.studentid,
              studentname : this.studentname,
              program : this.program,
              class : this.class,
              registration_date : this.registration_date,
              payment_type : this.payment_type,
              amount : this.pay_amount
            };
            this.save(data);
          }
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
