import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { EcactivityPage } from './ecactivity.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: EcactivityPage
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    EcactivityPage
    // PopmenuComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EcactivityPageModule {}
