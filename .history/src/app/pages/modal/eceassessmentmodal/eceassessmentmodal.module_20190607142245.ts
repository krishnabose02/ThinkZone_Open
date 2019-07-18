import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

//import { PopmenuComponent } from './../../components/popmenu/popmenu.component';

import { EceassessmentmodalPage } from './eceassessmentmodal.page';

const routes: Routes = [
  {
    path: '',
    component: EceassessmentmodalPage
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
    EceassessmentmodalPage
    //, PopmenuComponent
  ]
})
export class EceassessmentmodalPageModule {}
