import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ModalController, LoadingController  } from '@ionic/angular';
import { ExpensemodalPage } from './../modal/expensemodal/expensemodal.page';
import { RestApiService } from './../../rest-api.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.page.html',
  styleUrls: ['./expense.page.scss'],
})
export class ExpensePage implements OnInit {
  expense_list: any= [];
  total_amount: number= 0;
  total_amount_2decimal: any;
  final_data: any= [];

  constructor(private navController: NavController, private alertController: AlertController, private modalController: ModalController, private loadingController: LoadingController, private api: RestApiService ) {}
  ngOnInit() {}

  async add_expense(){
    const modal = await this.modalController.create({
      component: ExpensemodalPage,
      cssClass: 'expense-modal-css'
    });
    modal.onDidDismiss().then((detail: any) => {
      console.log('The result:', JSON.stringify(detail));
      if (detail !== null) {
        if(detail.role == 'backdrop'){}
        else{
          let expense_obj = detail.data;
          if(Object.keys(expense_obj).length > 0)
            this.expense_list.push(expense_obj);
          this.getTotalAmount();
        }
      }
   });
    return await modal.present();
  }

  async edit_expense(i: number){
    const modal = await this.modalController.create({
      component: ExpensemodalPage,
      cssClass: 'expense-modal-css'
    });
    modal.onDidDismiss().then((detail: any) => {
      console.log('The result:', JSON.stringify(detail));
      if (detail !== null) {
        if(detail.role == 'backdrop'){}
        else{
          let expense_obj = detail.data;
          if(Object.keys(expense_obj).length > 0)
            this.expense_list.push(expense_obj);
          this.getTotalAmount();
        }
      }
   });
    return await modal.present();
  }

  delete_expense(i: number){
    console.log('###index: '+i);
    this.expense_list.pop(i);
    this.getTotalAmount();
  }

  getTotalAmount(){
    this.total_amount = 0;
    this.expense_list.forEach(element => {
      let amt = parseFloat(element['amount'] || 0);
      this.total_amount += amt;
    });
    this.total_amount_2decimal= this.total_amount.toFixed(2);
    console.log('The total_amount_2decimal:', this.total_amount_2decimal);
  }

  async save_expense(){
    let userid = localStorage.getItem("_userid");
    let username = localStorage.getItem("_username");
    this.expense_list.forEach(element => {
      let typ = element['name'] || '';
      let amt = parseFloat(element['amount'] || 0);
      let obj = {
        userid: userid,
        username: username,
        expense_type: typ,
        expense_amount: amt
      }
      this.final_data.push(obj);
    });

    let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.savedailyexpense({data:this.final_data})
        .subscribe(res => {
          console.log(res);
          loading.dismiss();
          this.showAlert('Daily expenses', '', 'Daily expenses saved '+res['status']+' !!!');
        }, err => {
          console.log(err);
          loading.dismiss();
        });
        this.navController.navigateRoot('/home-results');
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
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }
}
