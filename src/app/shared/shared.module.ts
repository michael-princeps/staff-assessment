import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { QuestionsComponent } from '../questions/questions.component';
import { AssessmentsComponent } from '../assessments/assessments.component';
import { RouterModule } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [QuestionsComponent, AssessmentsComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NzMessageModule,
    LoadingBarModule,
    NzGridModule,
    NzRadioModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    NzTagModule,
    NzStepsModule,
    NzResultModule,
    NzModalModule,
    RouterModule,
    NzPaginationModule
  ],
  exports: [
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NzMessageModule,
    NzGridModule,
    LoadingBarModule,
    NzIconModule,
    NzRadioModule,
    NzMenuModule,
    NzLayoutModule,
    NzTagModule,
    NzStepsModule,
    NzResultModule,
    NzPaginationModule,
    QuestionsComponent,
    NzModalModule,
    RouterModule,
    AssessmentsComponent
  ]
})
export class SharedModule { }
