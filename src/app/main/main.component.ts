import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AssessmentService } from '../core/assessment.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QuestionsComponent } from '../questions/questions.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

// tslint:disable-next-line: class-name
interface assessments {
  status: string;
  message: string;
  assessments?: Array<any>;
}
interface questions {
  status: string;
  assessments?: Array<any>;
  message?: string;
}
// tslint:disable-next-line: class-name
interface answer {
  id: string;
  answer?: string;
}
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  timer;
  collapsed: boolean;
  confirmModal: NzModalRef;
  @ViewChild(QuestionsComponent) childComponent: QuestionsComponent;
  current = 0;
  direction;
  firstname: string;
  lastname: string;
  isLoading: boolean;
  assessments: Array<any> = [];
  expiredTest: any;
  questions: any[];
  submitted: boolean;
  result: any;
  showTimer: boolean;
  showSubmitInfo: boolean;

  constructor(private service: AssessmentService, private loadingBar: LoadingBarService, private message: NzMessageService, private modal: NzModalService) {
    this.firstname = sessionStorage.getItem('firstname');
    this.lastname = sessionStorage.getItem('lastname');
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    if (this.current === 1) {
      const result = confirm('Changes you made will not be saved.');
      if (result) {
        window.location.reload();
      }
      event.returnValue = false;
    }
  }

  ngOnInit(): void {
    this.fetchAssessment();
  }

  fetchAssessment() {
    this.loadingBar.start();
    this.service.fetchAssessments().subscribe((data: assessments) => {
      this.loadingBar.complete();
      // console.log(data);
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

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    if (this.current === 0) {
      this.fetchQuestions('april_2020');
    } else if (this.current === 1) {
      if (this.childComponent.answeredAll) {
        this.confirmModal = this.modal.confirm({
          nzTitle: 'Are you sure you are ready to submit?',
          nzContent: 'When you click the OK button, you can not make any changes again',
          nzOnOk: () =>
            this.childComponent.submit().then((data: any) => {
              this.current += 1;
              this.submitted = true;
              this.result = data;
            }).catch(() => this.message.error(''))
        });
      } else {
        this.modal.warning({
          nzTitle: 'Warning!',
          nzContent: 'You have to answer all questions.'
        });
      }
    } else {
      this.current += 1;
    }
  }
  done(): void {

  }

  startTimer() {
    this.countdownTimer(600);
    this.showTimer = true;
  }
  countdownTimer(duration: any) {
    let timer = duration;
    let minutes;
    let seconds;
    const interval = setInterval(() => {
      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      this.timer = minutes + ':' + seconds;
      if (--timer < 0) {
        clearInterval(interval);
        this.timer = 'expired';
        this.showSubmitInfo = true;
        this.childComponent.answeredAll = true;
        this.childComponent.submit().then((data: any) => {
          this.current += 1;
          this.submitted = true;
          this.showSubmitInfo = false;
          this.result = data;
        }).catch(() => {
          this.message.error('An error occured. Try again');
          this.showSubmitInfo = false;
        });
      }
    }, 1000);
  }
  fetchQuestions(id) {
    this.loadingBar.start();
    this.isLoading = true;
    this.service.fetchQuestions(id).subscribe((data: questions) => {
      this.loadingBar.stop();
      this.isLoading = false;
      // console.log(data);
      const objectives: { [key: string]: string } = {};
      const allAnswers = [];
      if (data.status === 'success') {
        this.current += 1;
        this.startTimer();
        this.questions = data.assessments;
        this.questions.map((element, index) => {
          objectives.A = element.A;
          objectives.B = element.B;
          objectives.C = element.C;
          objectives.D = element.D;
          element.answers = { ...objectives };
        });
      } else {
        this.isLoading = false;
        this.message.error(data.message);
        this.expiredTest = data.message;
      }
    }, (err: any) => {
      this.loadingBar.stop();
      this.message.error('Error connecting to server, please check your internet connection and try again');
    });
  }
  logout() {
    this.service.logout();
  }
}
