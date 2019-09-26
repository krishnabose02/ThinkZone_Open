import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Training1Page } from './training1.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: Training1Page,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: './pages/pgactivity2eng/pgactivity2eng.module#Pgactivity2engPageModule'
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: './pages/profile/profile.module#ProfilePageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class Training1PageRoutingModule {}