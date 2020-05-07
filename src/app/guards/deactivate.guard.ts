import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DeactivateComponent } from '../core/interfaces/deactivate';

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuard implements CanDeactivate<DeactivateComponent> {
  canDeactivate(
    component: DeactivateComponent): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canExit ? component.canExit() : true;
  }

}
