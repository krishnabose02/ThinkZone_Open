import { Component, OnInit } from '@angular/core';
import { DataService, DataObject } from 'src/app/services/data.service';

// File Download Imports
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx'; 
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

// File Opener
import { FileOpener } from '@ionic-native/file-opener/ngx';

// Video Player
import { VideoOptions, VideoPlayer } from '@ionic-native/video-player/ngx';


@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.page.html',
  styleUrls: ['./file-display.page.scss'],
})
export class FileDisplayPage implements OnInit {
  fileTransferObj: FileTransferObject; 
  dlprogress: string = '';

  sdcard_path = '';
  sdcard_filepath = '';
  doc_filepath_full = '';
  vid_filepath_full = '';

  selected_program = '';
  selected_subject = '';
  selected_month = '';
  selected_week = '';
  selected_activity = '';

  isVisited_video = false;
  isVisited_worksheet = false;

  toolbarshadow = true;
  page_title = 'Video Contents';
  icon = 'play';
  type = 'video';
  doc_path_list: DataObject[]
   = [ {path: 'asd', played: false},
          {path: 'asd', played: false}]
          ;


  constructor(private videoPlayer: VideoPlayer,
              private dataService: DataService,
              private file: File,
              private fileOpener: FileOpener,
              private fileTransfer: FileTransfer
            ) {
                this.doc_path_list = dataService.getDocumentData();
                if (this.dataService.getData('page_title') != null) {
                  this.page_title = this.dataService.getData('page_title');
                }
                if (this.dataService.getData('type') === 'video') {
                  this.icon = 'play';
                  this.type = 'video';
                } else {
                  this.icon = 'document';
                  this.type = 'sheet';
                }
                console.log(this.dataService.getData('type'));
                console.log(this.doc_path_list);
              }

  ngOnInit() {}

  async file_btn_click(file_obj){
    let file_url = file_obj.path;
    let url = encodeURI(file_url);
    let fileName = /[^/]*$/.exec(file_url)[0];  
    let local_directory = 'downloads';
    console.log('--> Inside download()    url: '+url+'    filename: '+fileName);
    
    this.fileTransferObj = this.fileTransfer.create();  

    // check if file is exist locally else download
    this.file.checkDir(this.file.externalDataDirectory, local_directory)
      .then(_ => this.file.checkFile(this.file.externalDataDirectory, local_directory+'/'+ fileName)
			  .then(_ => {
          //alert("A file with the same name already exists!");
          this.open_file(local_directory+'/'+ fileName);
        })
        .catch(err => this.fileTransferProcess()))
		  .catch(err => this.file.createDir(this.file.externalDataDirectory, local_directory, false)
			  .then(response => {
          //alert('New folder created:  ' + response.fullPath);
          this.fileTransferProcess();
        })
        .catch(err => {
				  alert('It was not possible to create Directory. Err: ' + JSON.stringify(err));
			  })			
		  );
  }

  async open_file(file_path){

  }

   // play video button click
   async play_video(data: {path: string, played: boolean}) {
    this.vid_filepath_full =  data.path;

    const voption: VideoOptions = {
      volume: 0.5,
      scalingMode: 0.5
    };
    this.videoPlayer.play(this.vid_filepath_full, voption).then(() => {
        data.played = true;
        // this.Enable_CompleteActivityButton();
      }).catch(e => {
        alert(JSON.stringify(e));
      });
  }
// open document button click
  async open_document(data: DataObject) {

    // data.path contains this.sdcard_filepath + '/THINKZONE/PGE/' + this.selected_subject.toLocaleUpperCase() + '/WORKSHEET'
    this.doc_filepath_full = data.path;
    const filename_new = Date.now();
    // copy file and show
    this.file.copyFile( this.doc_filepath_full, data.file_name,
                        this.file.externalApplicationStorageDirectory + '/files',
                        filename_new + '.pdf').then(result => {
      this.fileOpener.open(result.nativeURL, 'application/pdf')
        .then(() => {
          console.log('File is opened');
          data.played = true;
          // this.isVisited_worksheet = true;
          // this.Enable_CompleteActivityButton();
        }).catch(e => alert('Error opening file' + JSON.stringify(e)));
    }).catch(e => alert('Error copying file' + JSON.stringify(e)));
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
        console.log('top');
        this.toolbarshadow = true;
    } else {
        this.toolbarshadow = false;
    }
  }

  async download() {   
    let fileName = this.txt_ext;
    let filePath = this.txt_url;
    let url = encodeURI(filePath);  
    console.log('--> Inside download()    url: '+url+'    filename: '+fileName);
    this.fileTransferObj = this.fileTransfer.create();  
    
		// --> Directory exists with same name
    this.file.checkDir(this.file.externalDataDirectory, 'downloads')
      .then(_ => this.file.checkFile(this.file.externalDataDirectory, 'downloads/' + fileName)
			  .then(_ => {alert("A file with the same name already exists!")})
        .catch(err => this.fileTransferProcess()))
		  .catch(err => this.file.createDir(this.file.externalDataDirectory, 'downloads', false)
			  .then(response => {
          alert('New folder created:  ' + response.fullPath);
          this.fileTransferProcess();
        })
        .catch(err => {
				  alert('It was not possible to create the dir "downloads". Err: ' + JSON.stringify(err));
			  })			
		  );	
  }

  async fileTransferProcess(filePath, fileName){
    let url = encodeURI(filePath);  
    this.fileTransferObj = this.fileTransfer.create(); 

    this.fileTransferObj.onProgress((progressEvent) => {
      var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      //this.dlprogress = ''+perc;
      this.dlprogress = progressEvent.loaded+'/'+progressEvent.total;
      console.log('--> Downloaded '+progressEvent.loaded+' of Total '+progressEvent.total);
    });

    this.fileTransferObj.download(url, this.file.externalDataDirectory + '/downloads/' + fileName)
      .then((entry) => {
        alert('File saved in:  ' + entry.nativeURL);
      })
      .catch((err) =>{
        alert('Error saving file: ' + JSON.stringify(err));
      })
  }
}
