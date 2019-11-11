import { Component } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';

// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from './../../components/notifications/notifications.component';
import { RestApiService } from './../../rest-api.service';
import { TranslateConfigService } from './../../translate-config.service';


import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx'; 

@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage {
  fileTransferObj: FileTransferObject;  
  
  _username: string = localStorage.getItem('_username').toUpperCase();
  searchKey = '';
  yourLocation = '123 Test Street';
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';

  current_date: string;
  centers: any;
  date: number;
  month: string;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  toolbarshadow = true;
  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingController: LoadingController,
    public api: RestApiService,
    private translateConfigService: TranslateConfigService,
    private fileTransfer: FileTransfer,
    private file: File
  ) {
    this.centers = [];
    this.api.getcurrentdate()
        .subscribe(res => {
          console.log(res);
          if (Object.keys(res).length > 0 ) {
            this.current_date = res['current'];
          } else {
            this.current_date = '';
          }
        }, err => {
          console.log(err);
        });

        this.api.getallcentersallocatedbyuserid(localStorage.getItem('_userid'))
        .subscribe(res => {

          if (Object.keys(res).length > 0 ) {
            this.centers = res[0]['centers'];
          } else {
            this.centers = [];
          }
        }, err => {
          console.log(err);
        });

    const dt = new Date();
    this.date = dt.getDate();
    this.month = this.months[dt.getMonth()];
    this.setCheckinTime();
  }
  
  async setCheckinTime(){
    let obj = {
      userid : localStorage.getItem('_userid'),
      username : localStorage.getItem('_username'),
      checkintime : new Date()
    };
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.setcheckintime(obj).subscribe(res => {
        console.log('@@@Checkin: ' + res.status+'    document_id: '+res.document_id);
        localStorage.setItem('_document_id',res.document_id);
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  centerButtonClicked(center: any) {
    if (Object.keys(center).length > 0) {
      localStorage.setItem('_operationdate', this.current_date);
      localStorage.setItem('_centerid', center.centerid);
      localStorage.setItem('_centername', center.centername);
      this.navController.navigateForward('/center');
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  settings() {
    this.navController.navigateForward('settings');
  }

  async alertLocation() {
    const changeLocation = await this.alertCtrl.create({
      header: 'Change Location',
      message: 'Type your Address.',
      inputs: [
        {
          name: 'location',
          placeholder: 'Enter your new Location',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Change',
          handler: async (data) => {
            console.log('Change clicked', data);
            this.yourLocation = data.location;
            const toast = await this.toastCtrl.create({
              message: 'Location was change successfully',
              duration: 3000,
              position: 'top',
              closeButtonText: 'OK',
              showCloseButton: true
            });

            toast.present();
          }
        }
      ]
    });
    changeLocation.present();
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage
    });
    return await modal.present();
  }

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  async notifications(ev: any) {
    /*const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
    */
    this.navController.navigateForward('/message');
  }

  logScrolling(event) {
    // console.log(event);
    if (event.detail.currentY === 0) {
      console.log('top');
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }






  public download(fileName, filePath) {  
    //here encoding path as encodeURI() format.  
    let url = encodeURI(filePath);  
    //here initializing object.  
    this.fileTransferObj = this.transfer.create();  
    // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.  
    fileTransfer.download(url, this.file.externalRootDirectory + fileName, true).then((entry) => {  
        //here logging our success downloaded file path in mobile.  
        console.log('download completed: ' + entry.toURL());  
    }, (error) => {  
        //here logging our error its easier to find out what type of error occured.  
        console.log('download failed: ' + error);  
    });
}
