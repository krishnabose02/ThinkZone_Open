import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { Training2Page } from './training2.page';

const routes: Routes = [
  {
    path: '',
    component: Training2Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    Training2Page,
    ScreenOrientation
    //, PopmenuComponent
  ]
})
export class Training2PageModule {}
