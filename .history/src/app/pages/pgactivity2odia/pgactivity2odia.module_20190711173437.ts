import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { Pgactivity2odiaPage } from './pgactivity2odia.page';

const routes: Routes = [
  {
    path: '',
    component: Pgactivity2odiaPage
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
    Pgactivity2odiaPage
    //, PopmenuComponent
  ]
})
export class Pgactivity2odiaPageModule {}
