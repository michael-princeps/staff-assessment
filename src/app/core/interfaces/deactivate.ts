import { Observable } from 'rxjs/internal/Observable';

export interface DeactivateComponent {
    canExit: () => Observable<boolean> | Promise<boolean> | boolean;
}
