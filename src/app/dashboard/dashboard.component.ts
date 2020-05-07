import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../core/assessment.service';
import { LoadingBarService } from '@ngx-loading-bar/core';;
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  result: any;

  constructor(private service: AssessmentService, private loadingBar: LoadingBarService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loadingBar.start();
    this.service.loadDashboard().subscribe((data: any) => {
      this.loadingBar.complete();
      if (data.status === 'success') {
        this.result = data;
      } else {
        this.message.error(data.message);
      }
    }, err => {
      this.loadingBar.stop();
      this.message.error('Error connecting to server, please check your internet connection and try again');
    });
  }
}
