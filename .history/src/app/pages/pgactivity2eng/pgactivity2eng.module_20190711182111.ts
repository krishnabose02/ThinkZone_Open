import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { Pgactivity2engPage } from './pgactivity2eng.page';

const routes: Routes = [
  {
    path: '',
    component: Pgactivity2engPage
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
    Pgactivity2engPage
    //, PopmenuComponent
  ]
})
export class Pgactivity2engPageModule {}
