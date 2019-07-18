import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MessagebodyPage } from './mesaagebody.page';

const routes: Routes = [
  {
    path: '',
    component: MessagebodyPage
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
  declarations: [MessagebodyPage],
  entryComponents: [MessagebodyPage]
})
export class MessagebodyPageModule {}
