import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Modal Pages
import { ImagePageModule } from './pages/modal/image/image.module';
import { SearchFilterPageModule } from './pages/modal/search-filter/search-filter.module';
import { SigninPageModule } from './pages/modal/signin/signin.module';
import { MessagebodyPageModule } from './pages/modal/messagebody/messagebody.module';
import { ExpensemodalPageModule } from './pages/modal/expensemodal/expensemodal.module';
import { BaselinePageModule } from './pages/modal/baseline/baseline.module';
import { AttendancemodalPageModule } from './pages/modal/attendancemodal/attendancemodal.module';
import { HolidaymodalPageModule } from './pages/modal/holidaymodal/holidaymodal.module';
import { ViewpaymentPageModule } from './pages/modal/viewpayment/viewpayment.module';
import { MakepaymentPageModule } from './pages/modal/makepayment/makepayment.module';
import { EceassessmentmodalPageModule } from './pages/modal/eceassessmentmodal/eceassessmentmodal.module';
import { PgeengassessmentmodalPageModule } from './pages/modal/pgeengassessmentmodal/pgeengassessmentmodal.module';
import { PgemathassessmentmodalPageModule } from './pages/modal/pgemathassessmentmodal/pgemathassessmentmodal.module';
import { StudentregisterPageModule } from './pages/studentregister/studentregister.module' ;

import { Training2PageModule } from './pages/training2/training2.module';

// Components
import { NotificationsComponent } from './components/notifications/notifications.component';

// Camera
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';

// to access sd card
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

// file system access
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

// video player
import { VideoPlayer } from '@ionic-native/video-player/ngx';

// Push Notification FCM(Firebase Cloud Messaging)
import { FCM } from '@ionic-native/fcm/ngx';
import { CommonModule } from '@angular/common';

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';


import { FormsModule } from '@angular/forms';
// Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateConfigService } from './translate-config.service';
 
export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}


@NgModule({
  declarations: [AppComponent, NotificationsComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({
      scrollAssist: false
    }),
    AppRoutingModule,
    HttpClientModule,
    ImagePageModule,
    SigninPageModule,
    MessagebodyPageModule,
    ExpensemodalPageModule,
    SearchFilterPageModule,
    BaselinePageModule,
    AttendancemodalPageModule,
    HolidaymodalPageModule,
    ViewpaymentPageModule,
    MakepaymentPageModule,
    EceassessmentmodalPageModule,
    PgeengassessmentmodalPageModule,
    PgemathassessmentmodalPageModule,
    Training2PageModule,
    StudentregisterPageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (LanguageLoader),
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [NotificationsComponent],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    Geolocation,
    File,
    DocumentViewer,
    FileOpener,
    Diagnostic,
    VideoPlayer,
    FCM,
    ScreenOrientation,
    FileTransfer, FileTransferObject
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
