import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdminAuthGuardService {
    destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private authService: AuthService, private router: Router) {}

    canActivate() {
        return this.authService.isUserAdmin().pipe(
            map((isAdmin) => {
                if (!isAdmin) {
                    this.router.navigate(['/user']);
                }
                return isAdmin;
            }),
            catchError(() => {
                this.router.navigate(['/user']);
                return of(false);
            })
        );
    }
}

export const isAdminAuthenticated: CanActivateFn = () => {
    return inject(AdminAuthGuardService).canActivate();
};
