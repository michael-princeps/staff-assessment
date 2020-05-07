import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssessmentService } from './assessment.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private service: AssessmentService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.service.isLoggedIn()) {
      const token = this.service.getAuthToken();
      request = request.clone({
        setHeaders: {
          // 'Content-Type': 'application/json',
          Authorization: token
        }
      });
    }
    return next.handle(request).pipe(tap((data: any) => {
      if (data.body) {
          if (data.body.status === 'error' && data.body.message === 'Authorization failed, please login to continue ') {
              this.service.logout();
          }
      }
  }));
  }
}
