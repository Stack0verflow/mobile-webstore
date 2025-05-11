import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../services/common.service';
import { CartItem } from '../interfaces/Cart';

@Component({
    selector: 'app-menu',
    standalone: false,
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    isUserLoggedIn: boolean =
        localStorage.getItem('current-user') &&
        localStorage.getItem('current-user') !== 'null'
            ? true
            : false;

    cartItemNum: number = localStorage.getItem('cart')
        ? (JSON.parse(localStorage.getItem('cart')!) as CartItem[]).length
        : 0;

    constructor(private commonService: CommonService) {}

    ngOnInit(): void {
        this.commonService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (currentUser) => {
                    this.isUserLoggedIn = currentUser ? true : false;
                },
            });

        this.commonService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.cartItemNum++;
            },
        });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
