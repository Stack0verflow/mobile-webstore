import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-signup',
    standalone: false,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    hidePasswordSignup: boolean = true;
    hideConfirmPasswordSignup: boolean = true;

    signupForm = new FormGroup({
        email: new FormControl('', [
            Validators.pattern(environment.regex.email),
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.pattern(environment.regex.password),
            this.passwordsMustMatch('confirmPassword', true),
        ]),
        confirmPassword: new FormControl('', [
            Validators.required,
            Validators.pattern(environment.regex.password),
            this.passwordsMustMatch('password'),
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

    passwordsMustMatch(matchTo: string, reverse?: boolean): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.parent && reverse) {
                const c = (control.parent?.controls as any)[
                    matchTo
                ] as AbstractControl;
                if (c) {
                    c.updateValueAndValidity();
                }
                return null;
            }
            return !!control.parent &&
                !!control.parent.value &&
                control.value ===
                    (control.parent?.controls as any)[matchTo].value
                ? null
                : { mustMatch: true };
        };
    }

    signup(): void {
        const form = this.signupForm;

        if (form && form.valid) {
            this.authService
                .signup(
                    form.controls.email.value!,
                    form.controls.password.value!,
                    form.controls.confirmPassword.value!
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (user) => {
                        this.commonService.setCurrentUser(user);
                        this.commonService.openSnackBarSuccess(
                            'Successful signup!'
                        );
                        this.router.navigate(['/user/login']);
                    },
                    error: (error) => {
                        this.commonService.openSnackBarError(
                            error.error.message
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
