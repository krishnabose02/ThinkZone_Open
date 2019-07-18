import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { ShowpushnotificationPage } from './showpushnotification.page';

const routes: Routes = [
  {
    path: '',
    component: ShowpushnotificationPage
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
    ShowpushnotificationPage
    //, PopmenuComponent
  ]
})
export class ShowpushnotificationPageModule {}
