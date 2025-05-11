import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/interfaces/Product';
import { CartItem } from '../../../shared/interfaces/Cart';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-cart',
    standalone: false,
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
    cartItems: CartItem[] = localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart')!)
        : [];
    totalPriceText: string = 'Calculating...';

    constructor(private commonService: CommonService) {}

    ngOnInit(): void {
        this.calculateTotalPrice();
    }

    calculateTotalPrice() {
        this.totalPriceText = this.cartItems
            .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
            .toFixed(2);
    }

    modifyProductQuantity(product: Product, isAddition: boolean = true) {
        if (isAddition) {
            this.commonService.addProductToCart(product);
            this.cartItems[
                this.cartItems.findIndex(
                    (item) => item.product.serial === product.serial
                )
            ].quantity++;
        } else {
            const isProductDeleted =
                this.commonService.removeProductFromCart(product);
            if (isProductDeleted) {
                this.cartItems.splice(
                    this.cartItems.findIndex(
                        (item) => item.product.serial === product.serial
                    ),
                    1
                );
            } else {
                this.cartItems[
                    this.cartItems.findIndex(
                        (item) => item.product.serial === product.serial
                    )
                ].quantity--;
            }
        }
        this.calculateTotalPrice();
    }
}
