import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../shared/interfaces/User';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Order } from '../../../shared/interfaces/Order';
import { OrderService } from '../../../shared/services/order.service';

@Component({
    selector: 'app-profile',
    standalone: false,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    currentUser: User | null = null;
    orders: Order[] = [];

    constructor(
        private authService: AuthService,
        private commonService: CommonService,
        private orderService: OrderService,
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
                    } else {
                        this.getUserOrders(user.uuid);
                    }
                },
                error: () => {
                    this.router.navigate(['/user/login']);
                },
            });
    }

    getUserOrders(uuid: string) {
        this.orderService
            .getUserOrders(uuid)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (orders) => {
                    this.orders = orders;
                },
                error: () => {
                    this.commonService.openSnackBarError(
                        'Could not load orders.'
                    );
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
