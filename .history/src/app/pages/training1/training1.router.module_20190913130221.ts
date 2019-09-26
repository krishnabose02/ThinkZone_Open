import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Training1Page } from './training1.page';

const routes: Routes = [
  {
    path: 'training1',
    component: Training1Page,
    children: [
      {
        path: 'courses',
        children: [
          {
            path: '',
            loadChildren: '../pgactivity2eng/pgactivity2eng.module#Pgactivity2engPageModule'
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: './profile/profile.module#ProfilePageModule'
          }
        ]
      },
      {
        path: '',
        children: [
          {
            path: '',
            loadChildren: './profile/profile.module#ProfilePageModule'
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class Training1PageRoutingModule {}