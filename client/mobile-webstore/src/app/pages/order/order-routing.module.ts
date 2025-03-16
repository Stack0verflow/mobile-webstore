import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
    {
        path: 'cart',
        component: CartComponent,
        title: 'Cart - OneMobile',
    },
    {
        path: 'order',
        component: OrderComponent,
        title: 'Finish order - OneMobile',
    },
    {
        path: 'payment',
        component: PaymentComponent,
        title: 'Payment - OneMobile',
    },
    { path: '', redirectTo: 'cart', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrderRoutingModule {}
