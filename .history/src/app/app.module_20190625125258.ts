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

// Components
import { NotificationsComponent } from './components/notifications/notifications.component';

// Camera
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';
// file system access
import { File } from '@ionic-native/file/ngx';
// file opener
import { FileOpener } from '@ionic-native/file-opener/ngx';
// document viewer
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';

//import { Diagnostic } from '@ionic-native/diagnostic';


@NgModule({
  declarations: [AppComponent, NotificationsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
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
    PgemathassessmentmodalPageModule
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
    FileOpener
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
