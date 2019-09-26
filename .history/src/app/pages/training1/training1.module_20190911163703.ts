import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { Training1Page } from './training1.page';
import { Training1PageRoutingModule } from './training1.router.module';

const routes: Routes = [
  {
    path: '',
    component: Training1Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    Training1PageRoutingModule
  ],
  declarations: [
    Training1Page
    //, PopmenuComponent
  ]
})
export class Training1PageModule {}
