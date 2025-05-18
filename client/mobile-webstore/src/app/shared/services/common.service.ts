import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../interfaces/User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../interfaces/Product';
import { CartItem } from '../interfaces/Cart';

@Injectable({
    providedIn: 'root',
})
export class CommonService {
    currentUserSubject: Subject<User | null> = new Subject<User | null>();
    currentUser$: Observable<User | null> =
        this.currentUserSubject.asObservable();
    cartItemsSubject: Subject<CartItem | null> = new Subject<CartItem | null>();
    cartItems$: Observable<CartItem | null> =
        this.cartItemsSubject.asObservable();

    constructor(private snackBar: MatSnackBar) {}

    setCurrentUser(currentUser: User | null) {
        localStorage.setItem('current-user', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
    }

    addProductToCart(newProduct: Product) {
        const cartItems: CartItem[] = localStorage.getItem('cart')
            ? JSON.parse(localStorage.getItem('cart')!)
            : [];

        if (
            !cartItems.some(
                (cartItem) => cartItem.product.serial === newProduct.serial
            )
        ) {
            const newItem: CartItem = {
                product: newProduct,
                quantity: 1,
            };
            cartItems.push(newItem);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            this.cartItemsSubject.next(newItem);
        } else {
            cartItems.map((cartItem) => {
                if (cartItem.product.serial === newProduct.serial) {
                    cartItem.quantity++;
                    localStorage.setItem('cart', JSON.stringify(cartItems));
                }
            });
        }
    }

    removeProductFromCart(product: Product): boolean {
        const cartItems: CartItem[] = localStorage.getItem('cart')
            ? JSON.parse(localStorage.getItem('cart')!)
            : [];

        const productIndex = cartItems.findIndex(
            (item) => item.product.serial === product.serial
        );

        let isDeleted: boolean = false;
        // delete the item from the cart if its current quantity was 1, else just reduce the value by one
        if (cartItems[productIndex].quantity === 1) {
            cartItems.splice(productIndex, 1);
            isDeleted = true;
        } else {
            cartItems[productIndex].quantity--;
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));

        return isDeleted;
    }

    emptyCart() {
        localStorage.removeItem('cart');
        this.cartItemsSubject.next(null);
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
