import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { QuestionsComponent } from '../questions/questions.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'assessment',
        pathMatch: 'full'
      },
      // {
      //   path: 'assessment',
      //   loadChildren: () => import('../assessments/assessments.module').then(m => m.AssessmentsModule)
      // },
      {
        path: 'assessment',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
