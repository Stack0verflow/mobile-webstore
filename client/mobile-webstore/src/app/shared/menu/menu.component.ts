import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../services/common.service';
import { CartItem } from '../interfaces/Cart';
import { User } from '../interfaces/User';

@Component({
    selector: 'app-menu',
    standalone: false,
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    currentUser: User | null = localStorage.getItem('current-user')
        ? JSON.parse(localStorage.getItem('current-user')!)
        : null;

    cartItemNum: number = localStorage.getItem('cart')
        ? (JSON.parse(localStorage.getItem('cart')!) as CartItem[]).length
        : 0;

    constructor(private commonService: CommonService) {}

    ngOnInit(): void {
        this.commonService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (currentUser) => {
                    this.currentUser = currentUser;
                },
            });

        this.commonService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (cartItem) => {
                if (cartItem) {
                    this.cartItemNum++;
                } else {
                    this.cartItemNum = 0;
                }
            },
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
