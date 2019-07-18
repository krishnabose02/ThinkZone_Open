import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController, LoadingController, AlertController, NavParams } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-expensemodal',
  templateUrl: './expensemodal.page.html',
  styleUrls: ['./expensemodal.page.scss'],
})
export class ExpensemodalPage implements OnInit {
  public expenseModalFormGroup: FormGroup;
  selectedExpense: any='Fuel';
  _status: boolean = true;
  _message: string = '';
  expense: any={};
  isOtherSelected: boolean= false;
  otherExpenseString: any= '';

  editData: any;
  default_name: string= "";
  default_name2: string= "";
  default_amount: number= 1;
  

  @Input() value: any;
  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public navParams: NavParams
  ) {
    this.expenseModalFormGroup = this.formBuilder.group({
      amount: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.editData = this.navParams.data.editData;
    console.log('&&& editData: '+Object.keys(this.editData).length+'    = '+JSON.stringify(this.editData));
    if(this.editData) != undefined){
      this.default_name = this.editData.name;
      this.default_name2 = this.editData.name2;
      this.default_amount = this.editData.amount;
    }else{
      this.default_name = '';
      this.default_name2 = '';
      this.default_amount = 1;
    }
    this.expenseModalFormGroup = this.formBuilder.group({
      'amount': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  async closeModal() {
    await this.modalController.dismiss(this.expense);
  }

  selectOnChange(expense_name: any){
    console.log('###expense_name: '+expense_name);
    this.selectedExpense= expense_name;

    if(expense_name == 'Other')
      this.isOtherSelected = true;
    else
      this.isOtherSelected = false;
  }

  otherExpOnChange(other_expense_name: any){
    console.log('###other_expense_name: '+JSON.stringify(other_expense_name));
    this.otherExpenseString = other_expense_name;
  }

  /*closeModal() {
    this.modalController.dismiss();
  }*/

  async add_expense() {
    let name = this.selectedExpense;
    if(this.isOtherSelected == true){
      name = 'Other: '+this.otherExpenseString;
    }else{
      name = this.selectedExpense;
    }
    this._status = true;
    this.expense = {
      name: name,
      amount: parseFloat(this.expenseModalFormGroup.value.amount).toFixed(2)
    }
    console.log('@@@ expense: '+JSON.stringify(this.expense));
    this.closeModal();
  }

}
