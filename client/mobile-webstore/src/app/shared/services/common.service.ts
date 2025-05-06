import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../interfaces/User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../interfaces/Product';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    currentUserSubject: Subject<User | null> = new Subject<User | null>();
    currentUser$: Observable<User | null> =
        this.currentUserSubject.asObservable();
    cartItemsSubject: Subject<Product> = new Subject<Product>();
    cartItems$: Observable<Product> = this.cartItemsSubject.asObservable();

    constructor(private snackBar: MatSnackBar) {}

    setCurrentUser(currentUser: User | null) {
        localStorage.setItem('current-user', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
    }

    addProductToCart(newProduct: Product) {
        let cartProducts: Product[] = localStorage.getItem('cart')
            ? JSON.parse(localStorage.getItem('cart')!)
            : [];

        if (
            !cartProducts.some(
                (product) => product.serial === newProduct.serial
            )
        ) {
            cartProducts.push(newProduct);
            localStorage.setItem('cart', JSON.stringify(cartProducts));
            this.cartItemsSubject.next(newProduct);
        }

        console.log(cartProducts);
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
