import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { shareReplay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(private http: HttpClient, private router: Router) { }

  storeToken(token) {
    sessionStorage.setItem('token', token);
  }

  getAuthToken() {
    return sessionStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getAuthToken();
  }
  login(email: string, password: string) {
    return this.http.post(`${environment.apiUrl}staff-login`, { email, password }).pipe(tap((data: any) => {
      if (data.status === 'success') {
        sessionStorage.setItem('firstname', data.user.firstname);
        sessionStorage.setItem('lastname', data.user.lastname);
        this.storeToken(data.token);
      }
    }));
  }

  resetpassword(email: string) {
    return this.http.post(`${environment.apiUrl}staff/reset/password`, { email });
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/auth/login']);
  }

  // tslint:disable-next-line: variable-name
  fetchQuestions(assessment_id) {
    return this.http.post(`${environment.apiUrl}assessment/questions`, { assessment_id });
  }

  fetchAssessments() {
    return this.http.get(`${environment.apiUrl}assessment/list`);
  }

  // tslint:disable-next-line: variable-name
  submitAnswers(assessment_id: string, answers: any[]) {
    return this.http.post(`${environment.apiUrl}assessment/answer`, { assessment_id, answers });
  }

  loadDashboard() {
    return this.http.get(`${environment.apiUrl}assessment/dashboard`);
  }
}
