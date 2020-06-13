import { Component, OnInit, HostListener, Input } from '@angular/core';
import { AssessmentService } from '../core/assessment.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DeactivateComponent } from '../core/interfaces/deactivate';
import { ActivatedRoute, Params } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

// tslint:disable-next-line: class-name
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
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  timer;
  @Input() allQuestions: any[];
  @Input() testId;
  current = 0;
  showTimer: boolean;
  assessments: Array<any>;
  answers: answer[] = [];
  started = false;
  expiredTest: string;
  assessmentId: any;
  answeredAll: boolean;
  constructor(private service: AssessmentService, private loadingBar: LoadingBarService, private message: NzMessageService, private route: ActivatedRoute, private modal: NzModalService) {
  }

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    if (this.started) {
      const result = confirm('Changes you made will not be saved.');
      if (result) {
        window.location.reload();
      }
      event.returnValue = false;
    }
  }
  canExit(): boolean {
    if (this.started) {
      return window.confirm('Discard changes?');
    }
    return true;
  }
  ngOnInit(): void {
    // console.log(this.allQuestions);
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
      }
    }, 1000);
  }
  startTimer() {
    this.countdownTimer(300);
    this.showTimer = true;
  }

  fetchQuestions(id) {
    this.loadingBar.start();
    this.service.fetchQuestions(id).subscribe((data: questions) => {
      this.loadingBar.stop();
      // console.log(data);
      const objectives: { [key: string]: string } = {};
      if (data.status === 'success') {
        this.assessments = data.assessments;
        this.assessments.forEach(element => {
          objectives.A = element.A;
          objectives.B = element.B;
          objectives.C = element.C;
          objectives.D = element.D;
          element.answers = objectives;
        });
        // this.assessments.map(item => ({...item, answers: obj}));
        // console.log(this.assessments);
      } else {
        this.message.error(data.message);
        this.expiredTest = data.message;
      }
    }, (err: any) => {
      this.loadingBar.stop();
      this.message.error('Error connecting to server, please check your internet connection and try again');
    });
  }

  selectAnswer(event, testId) {
    this.started = true;
    // console.log(event.target.value, testId);
    const selectedAnswer: answer = {
      id: testId,
      answer: event.target.value,
    };
    // tslint:disable-next-line: no-shadowed-variable
    const itemIndex = this.answers.findIndex((answer: answer) => {
      return answer.id === testId;
    });
    if (itemIndex > -1) {
      this.answers[itemIndex] = selectedAnswer;
    } else {
      this.answers.push(selectedAnswer);
      if (this.answers.length === this.allQuestions.length) {
        // console.log('full')
        this.answeredAll = true;
      }
    }
  }
  checkDefault(ind, key) {
    const checked = this.answers[ind];
    if (checked) {
      if (checked.answer === key) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  submit() {
    this.loadingBar.start();
    // console.log(this.answers);
    return new Promise((resolve, reject) => {
      this.service.submitAnswers(this.testId, this.answers).subscribe((data: any) => {
        this.loadingBar.stop();
        // console.log(data);
        if (data.status === 'success') {
          // console.log(data);
          resolve(data);
        } else {
          reject(data);
        }
      }, err => {
        this.loadingBar.stop();
        // console.log(err);
        this.message.error('Error connecting to server, please check your internet connection and try again');
        reject(err);
      });
    });
  }
  pre(): void {
    this.current -= 1;
  }
  next(): void {
    // this.current += 1;
    // const foundIndex = this.allQuestions.findIndex((answer: answer) => answer.id === '');
    if (this.answers.length === this.allQuestions.length) {
      this.current += 1;
      this.answeredAll = true;
    } else {
      if (this.answers[this.current]) {
        this.current += 1;
      } else {
        this.modal.warning({
          nzTitle: 'Warning!',
          nzContent: 'You have to answer all questions.'
        });
      }
    }
  }
}
