import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { RestApiService } from './../../../rest-api.service';

@Component({
  selector: 'app-messagebody',
  templateUrl: './messagebody.page.html',
  styleUrls: ['./messagebody.page.scss'],
})
export class MessagebodyPage implements OnInit {
  public signinFormGroup: FormGroup;
  _status: boolean = true;
  _message: string = '';
  @Input() res: any;

  @Input() value: any;
  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public api: RestApiService,
  ) {
    this.signinFormGroup = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    console.log('@#@#res: '+this.res);

    this.signinFormGroup = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async signin() {
    this._status = true;
    let data = {
      userid: this.signinFormGroup.value.email,
      password: this.signinFormGroup.value.password,
      usertype: 'manager'
    }
    console.log('@@@ data: '+JSON.stringify(data));
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.authenticateuser(data)
      .subscribe(res => {
        console.log('###res: '+res);
        loading.dismiss();
        if(res['success'] == 'success'){
          this._status = true;
          this._message = "";

          localStorage.setItem('_userid', res['userid']);
          localStorage.setItem('_username', res['username']);
          localStorage.setItem('_emailid', res['emailid']);
          this.navController.navigateRoot('/home-results');
          this.closeModal();
        }else{
          this._status = false;
          this._message = "Invalid credentials !!!";
        }            
      }, err => {
        this._status = false;
          this._message = "Connection error !!!";
        console.log('###error: '+err);
        loading.dismiss();
      });
  }

}
