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
  { path: 'pgactivity2', loadChildren: './pages/pgactivity2/pgactivity2.module#Pgactivity2PageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
