import { Component, NgZone } from '@angular/core';
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
  selector: 'app-viewpayment',
  templateUrl: './viewpayment.page.html',
  styleUrls: ['./viewpayment.page.scss']
})
export class ViewpaymentPage {
  res : any;
  records : any =[];

  constructor(
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
    
    // modal paramiters
    this.res = this.navParams.data.student;
    console.log('###modal paramiters: ' + JSON.stringify(this.res));

    let studentid = this.res.studentid;
    this.getrecords(studentid);
  }

  async getrecords(studentid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltchpaymentdetailsbystudentid(studentid)
      .subscribe(res => {
        // console.log('@@@all student list: ' + JSON.stringify(res));
        //this.showAlert('Info','','Payment '+res['status']+' !!!');
        this.records = res;
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
