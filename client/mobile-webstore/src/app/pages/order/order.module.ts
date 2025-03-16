import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
    declarations: [CartComponent, OrderComponent, PaymentComponent],
    imports: [CommonModule, OrderRoutingModule],
})
export class OrderModule {}
