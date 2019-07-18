import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExpensemodalPage } from './expensemodal.page';

const routes: Routes = [
  {
    path: '',
    component: ExpensemodalPage
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
  declarations: [ExpensemodalPage],
  entryComponents: [ExpensemodalPage]
})
export class ExpensemodalPageModule {}
