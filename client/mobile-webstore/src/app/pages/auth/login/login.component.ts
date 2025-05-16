import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    hidePasswordLogin: boolean = true;

    loginForm = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.pattern(environment.regex.email),
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.pattern(environment.regex.password),
        ]),
    });

    constructor(
        private authService: AuthService,
        private commonService: CommonService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.checkCurrentUser();
    }

    checkCurrentUser(): void {
        this.authService
            .getCurrentUser()
            .pipe(takeUntil(this.destroy$))
            .subscribe((user) => {
                if (user) {
                    this.router.navigate(['/user/profile']);
                }
            });
    }

    login() {
        if (this.loginForm && this.loginForm.valid) {
            this.authService
                .login(
                    this.loginForm.controls.email.value!,
                    this.loginForm.controls.password.value!
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (user) => {
                        this.commonService.setCurrentUser(user);
                        this.commonService.openSnackBarSuccess(
                            'Logged in successfully!'
                        );
                        this.router.navigate(['/user/profile']);
                    },
                    error: () => {
                        this.commonService.openSnackBarError(
                            'Incorrect credentials!'
                        );
                    },
                });
        }
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
