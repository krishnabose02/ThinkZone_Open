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
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


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

  dlprogress: string = '';
  txt_url: string = '';
  txt_ext: string = '';
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
    private file: File,
    private http: HttpClient
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






  public download() {   
    console.log('--> Inside download()    url: '+this.txt_url+'    ext: '+this.txt_ext);
    let fileName = this.txt_ext;
    let filePath = this.txt_url;
    let url = encodeURI(filePath);  
    this.fileTransferObj = this.fileTransfer.create();  

    this.fileTransferObj.onProgress((progressEvent) => {
        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        this.dlprogress = ''+perc;
        console.log('--> '+this.dlprogress+' % downloaded');
      });

    /*this.fileTransferObj.download(url, this.file.externalDataDirectory + fileName, true).then((entry) => {  
        alert('download completed: ' + entry.toURL());  
      }, (error) => {  
        console.log('download failed: ' + JSON.stringify(error));  
        alert('download failed: ' + JSON.stringify(error));  
      });
    */
    // new method
		// --> Directory exists with same name
    this.file.checkDir(this.file.externalRootDirectory, 'downloads')
      .then(_ => this.file.checkFile(this.file.externalRootDirectory, 'downloads/' + fileName)
			  .then(_ => {alert("A file with the same name already exists!")})
			  .catch(err =>
          this.fileTransferObj.download(url, this.file.externalRootDirectory + '/downloads/' + fileName)
            .then((entry) => {
			    	  alert('File saved in:  ' + entry.nativeURL);
			      })
			      .catch((err) =>{
			    	  alert('Error saving file: ' + JSON.stringify(err));
			      })
			  ))
		  .catch(err => this.file.createDir(this.file.externalRootDirectory, 'downloads', false)
			  .then(response => {
				  alert('New folder created:  ' + response.fullPath);
          this.fileTransferObj.download(url, this.file.externalRootDirectory + '/downloads/' + fileName)
            .then((entry) => {
			    	  alert('File saved in : ' + entry.nativeURL);
			      })
			      .catch((err) =>{
			    	  alert('Error saving file:  ' + JSON.stringify(err));
			      });
        })
        .catch(err => {
				  alert('It was not possible to create the dir "downloads". Err: ' + JSON.stringify(err));
			  })			
		  );	
  }

  public download1(){
    
		console.log('--> Folder: shared/test_video.mp4    Token: BHEWNHYtHCAAAAAAAAAAESt6qAwTFtvwLmUNGxMOvt5wBHFPS1wIqoMg8O-hRUKC');
		let headers = new Headers();
		headers.append('Authorization', 'Bearer BHEWNHYtHCAAAAAAAAAAESt6qAwTFtvwLmUNGxMOvt5wBHFPS1wIqoMg8O-hRUKC');
		headers.append('Dropbox-API-Arg','{"path": "/shared/test_video.mp4"}');
		console.log(headers);
		 	const req = this.http.post('https://content.dropboxapi.com/2/files/download',null, {
	    			headers: new HttpHeaders()
	    			.set('Authorization', ('Bearer BHEWNHYtHCAAAAAAAAAAESt6qAwTFtvwLmUNGxMOvt5wBHFPS1wIqoMg8O-hRUKC')
					).append('Dropbox-API-Arg',' {"path":"/shared/test_video.mp4"}'),
					

	  			}
			 )
		    .subscribe(
		        response => {
		          	console.log(response);
		          	const entries = response['entries'];
		          	console.log(entries);
		          	const names = entries.map(entry => entry.name);
		          	console.log(names);
		        },
		        err => {
		  			
		          	console.log("Error occured");
		          	console.log(err);
	        	},
	        	() => {
		          	console.log("Completion occured");
	        	}
	      	);    
  }
}
