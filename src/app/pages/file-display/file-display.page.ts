import { Component, OnInit } from '@angular/core';
import { VideoOptions, VideoPlayer } from '@ionic-native/video-player/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { DataService, DataObject } from 'src/app/services/data.service';


@Component({
  selector: 'app-file-display',
  templateUrl: './file-display.page.html',
  styleUrls: ['./file-display.page.scss'],
})
export class FileDisplayPage implements OnInit {


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
              private fileOpener: FileOpener) {
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

  ngOnInit() {
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
}
