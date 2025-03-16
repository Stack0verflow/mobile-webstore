import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../interfaces/User';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    currentUserSubject: Subject<User | null> = new Subject<User | null>();
    currentUser$: Observable<User | null> =
        this.currentUserSubject.asObservable();

    constructor(private snackBar: MatSnackBar) {}

    setCurrentUser(currentUser: User | null) {
        localStorage.setItem('current-user', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
    }

    openSnackBarSuccess(
        message: string,
        actionText: string = 'Close',
        duration: number = 3000
    ) {
        this.snackBar.open(message, actionText, {
            duration: duration,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackbar-success',
        });
    }

    openSnackBarError(
        message: string,
        actionText: string = 'Close',
        duration: number = 3000
    ) {
        this.snackBar.open(message, actionText, {
            duration: duration,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackbar-error',
        });
    }

    openSnackBarInfo(
        message: string,
        actionText: string = 'Close',
        duration: number = 3000
    ) {
        this.snackBar.open(message, actionText, {
            duration: duration,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'snackbar-info',
        });
    }
}
