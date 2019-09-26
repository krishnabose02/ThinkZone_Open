import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'edit-profile', loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'home-results', loadChildren: './pages/home-results/home-results.module#HomeResultsPageModule' },
  { path: 'center', loadChildren: './pages/center/center.module#CenterPageModule' },
  { path: 'feedback', loadChildren: './pages/feedback/feedback.module#FeedbackPageModule' },
  { path: 'payment', loadChildren: './pages/payment/payment.module#PaymentPageModule' },
  { path: 'assessment', loadChildren: './pages/assessment/assessment.module#AssessmentPageModule' },
  { path: 'community', loadChildren: './pages/community/community.module#CommunityPageModule' },
  { path: 'issues', loadChildren: './pages/issues/issues.module#IssuesPageModule' },
  { path: 'expense', loadChildren: './pages/expense/expense.module#ExpensePageModule' },
  { path: 'message', loadChildren: './pages/message/message.module#MessagePageModule' },
  { path: 'student', loadChildren: './pages/student/student.module#StudentPageModule' },
  { path: 'studentexplor', loadChildren: './pages/studentexplor/studentexplor.module#StudentExplorPageModule' },
  { path: 'attendance', loadChildren: './pages/attendance/attendance.module#AttendancePageModule' },
  { path: 'tchpayment', loadChildren: './pages/tchpayment/tchpayment.module#TchpaymentPageModule' },
  { path: 'ecassessment', loadChildren: './pages/ecassessment/ecassessment.module#EcassessmentPageModule' },
  { path: 'pgassessment', loadChildren: './pages/pgassessment/pgassessment.module#PgassessmentPageModule' },
  { path: 'ecactivity', loadChildren: './pages/ecactivity/ecactivity.module#EcactivityPageModule' },
  { path: 'ecactivity2', loadChildren: './pages/ecactivity2/ecactivity2.module#Ecactivity2PageModule' },
  { path: 'pgactivity', loadChildren: './pages/pgactivity/pgactivity.module#PgactivityPageModule' },
  { path: 'pgactivity2', loadChildren: './pages/pgactivity2/pgactivity2.module#Pgactivity2PageModule' },
  { path: 'pgactivityodia', loadChildren: './pages/pgactivityodia/pgactivityodia.module#PgactivityodiaPageModule' },
  { path: 'pgactivity2odia', loadChildren: './pages/pgactivity2odia/pgactivity2odia.module#Pgactivity2odiaPageModule' },
  { path: 'pgactivityeng', loadChildren: './pages/pgactivityeng/pgactivityeng.module#PgactivityengPageModule' },
  { path: 'pgactivity2eng', loadChildren: './pages/pgactivity2eng/pgactivity2eng.module#Pgactivity2engPageModule' },
  { path: 'showpushnotification/:message', loadChildren: './pages/showpushnotification/showpushnotification.module#ShowpushnotificationPageModule' },
  { path: 'training1', loadChildren: './pages/training1/training1.module#Training1PageModule' },
  { path: 'training2', loadChildren: './pages/training2/training2.module#Training2PageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
