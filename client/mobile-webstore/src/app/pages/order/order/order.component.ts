import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../shared/interfaces/User';
import { CartItem } from '../../../shared/interfaces/Cart';
import { CommonService } from '../../../shared/services/common.service';
import { AuthService } from '../../../shared/services/auth.service';
import { OrderService } from '../../../shared/services/order.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-order',
    standalone: false,
    templateUrl: './order.component.html',
    styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();

    currentUser: User | null = null;
    cartItems: CartItem[] = localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart')!)
        : [];

    orderForm = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.pattern(environment.regex.email),
        ]),
        phone: new FormControl('+99123456789', [Validators.required]),
        shippingMethod: new FormControl('standard', [Validators.required]),
        shippingAddress: new FormGroup({
            firstName: new FormControl('Ezio', [Validators.required]),
            lastName: new FormControl('Auditore', [Validators.required]),
            country: new FormControl('Italy', [Validators.required]),
            city: new FormControl('Florence', [Validators.required]),
            zip: new FormControl('50122', [Validators.required]),
            street: new FormControl('Mario Street', [Validators.required]),
            houseNumber: new FormControl('123.', [Validators.required]),
        }),
        billingAddress: new FormGroup({
            firstName: new FormControl('Ezio', [Validators.required]),
            lastName: new FormControl('Auditore', [Validators.required]),
            country: new FormControl('Italy', [Validators.required]),
            city: new FormControl('Florence', [Validators.required]),
            zip: new FormControl('50122', [Validators.required]),
            street: new FormControl('Mario Street', [Validators.required]),
            houseNumber: new FormControl('123.', [Validators.required]),
        }),
        paymentMethod: new FormControl('paypal', [Validators.required]),
    });

    constructor(
        private commonService: CommonService,
        private authService: AuthService,
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
                    this.orderForm.controls.email.setValue(
                        this.currentUser.email
                    );
                },
                error: () => {
                    this.currentUser = null;
                },
            });
    }

    submitOrder() {
        const form = this.orderForm;

        if (form && form.valid) {
            const contact = {
                email: form.controls.email.value!,
                phone: form.controls.phone.value!,
            };
            const shippingAddress = {
                firstName:
                    form.controls.shippingAddress.controls.firstName.value!,
                lastName:
                    form.controls.shippingAddress.controls.lastName.value!,
                country: form.controls.shippingAddress.controls.country.value!,
                city: form.controls.shippingAddress.controls.city.value!,
                zip: form.controls.shippingAddress.controls.zip.value!,
                street: form.controls.shippingAddress.controls.street.value!,
                houseNumber:
                    form.controls.shippingAddress.controls.houseNumber.value!,
            };
            const billingAddress = {
                firstName:
                    form.controls.billingAddress.controls.firstName.value!,
                lastName: form.controls.billingAddress.controls.lastName.value!,
                country: form.controls.billingAddress.controls.country.value!,
                city: form.controls.billingAddress.controls.city.value!,
                zip: form.controls.billingAddress.controls.zip.value!,
                street: form.controls.billingAddress.controls.street.value!,
                houseNumber:
                    form.controls.billingAddress.controls.houseNumber.value!,
            };

            const products: string[] = this.cartItems.map(
                (item) => item.product.serial
            );

            const totalPrice: number = this.cartItems.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0
            );

            this.orderService
                .makeOrder(
                    this.currentUser!,
                    contact,
                    products,
                    shippingAddress,
                    form.controls.shippingMethod.value!,
                    billingAddress,
                    form.controls.paymentMethod.value!,
                    totalPrice
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (order) => {
                        this.commonService.emptyCart();
                        this.commonService.openSnackBarSuccess('Order made!');
                        this.router.navigate(['user/profile']);
                    },
                    error: () => {
                        this.commonService.openSnackBarError(
                            'Could not create new model!'
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
