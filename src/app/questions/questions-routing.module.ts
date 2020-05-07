import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionsComponent } from './questions.component';
import { DeactivateGuard } from '../guards/deactivate.guard';


const routes: Routes = [
  {
    path: '',
    canDeactivate: [DeactivateGuard],
    component: QuestionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule { }
