import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AssessmentService } from 'src/app/core/assessment.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  resetForm: FormGroup;
  loading: boolean;
  isResetSuccess: boolean;
  constructor(private formbuilder: FormBuilder, private loadingBar: LoadingBarService, private service: AssessmentService, private message: NzMessageService) {
    this.initialiseForm();
   }

  ngOnInit(): void {

  }

  initialiseForm() {
    this.resetForm = this.formbuilder.group({
      email: [null, [Validators.email, Validators.required]]
    });
  }

  get email() { return this.resetForm.get('email'); }

  getErrorMessage() {
    // tslint:disable-next-line
    for (const i in this.resetForm.controls) {
      this.resetForm.controls[i].markAsDirty();
      this.resetForm.controls[i].updateValueAndValidity();
    }
  }
  reset(formvalue) {
    if (this.resetForm.invalid) {
      this.getErrorMessage();
      return false;
    }
    this.loadingBar.start();
    this.loading = true;
    this.resetForm.disable();
    this.service.resetpassword(formvalue.email).subscribe((data: any) => {
      this.loading = false;
      this.loadingBar.complete();
      this.resetForm.enable();
      if (data.status === 'success') {
        this.isResetSuccess = true;
      } else {
        this.resetForm.setErrors({
          emailnotfound: data.message
        });
      }
    }, err => {
      this.resetForm.enable();
      this.loadingBar.complete();
      this.message.error('Error connecting to server. Please try again');
    });
  }

}
