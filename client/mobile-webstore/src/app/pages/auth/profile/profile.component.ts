import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../shared/interfaces/User';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-profile',
    standalone: false,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    currentUser: User | null = null;

    constructor(
        private authService: AuthService,
        private commonService: CommonService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getCurrentUser();
    }

    getCurrentUser() {
        this.authService
            .getCurrentUser()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (user) => {
                    this.currentUser = user;
                    if (user === null) {
                        this.router.navigate(['/user/login']);
                    }
                },
                error: () => {
                    this.router.navigate(['/user/login']);
                },
            });
    }

    logout() {
        this.authService
            .logout()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (message) => {
                    this.commonService.setCurrentUser(null);
                    this.commonService.openSnackBarSuccess(message.message);
                    this.router.navigate(['/user/login']);
                },
                error: (message) => {
                    this.commonService.openSnackBarError(message);
                },
            });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
