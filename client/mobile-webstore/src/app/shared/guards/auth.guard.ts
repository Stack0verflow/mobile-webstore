import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService {
    destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private authService: AuthService, private router: Router) {}

    canActivate() {
        return this.authService.getCurrentUser().pipe(
            map((user) => {
                if (!user) {
                    this.router.navigate(['/user']);
                    return false;
                }
                return true;
            }),
            catchError(() => {
                this.router.navigate(['/user']);
                return of(false);
            })
        );
    }
}

export const isUserAuthenticated: CanActivateFn = () => {
    return inject(AuthGuardService).canActivate();
};
