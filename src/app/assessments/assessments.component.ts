import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../core/assessment.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NzMessageService } from 'ng-zorro-antd/message';

// tslint:disable-next-line: class-name
interface assessments {
  status: string;
  message: string;
  assessments?: Array<any>;
}
@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss']
})
export class AssessmentsComponent implements OnInit {
  assessments: Array<any> = [];
  constructor(private service: AssessmentService, private loadingBar: LoadingBarService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.fetchAssessment();
  }

  fetchAssessment() {
    this.loadingBar.start();
    this.service.fetchAssessments().subscribe((data: assessments) => {
      this.loadingBar.complete();
      console.log(data);
      if (data.status === 'success') {
        this.assessments = data.assessments;
      } else {
        this.message.error(data.message);
      }
    }, err => {
      this.loadingBar.stop();
      this.message.error('Error connecting to server, please check your internet connection and try again');
    });
  }
}
