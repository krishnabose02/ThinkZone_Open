import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { Ecactivity2Page } from './ecactivity2.page';

const routes: Routes = [
  {
    path: '',
    component: Ecactivity2Page
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
    Ecactivity2Page
    //, PopmenuComponent
  ]
})
export class Ecactivity2PageModule {}
