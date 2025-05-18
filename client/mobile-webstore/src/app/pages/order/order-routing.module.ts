import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { PaymentComponent } from './payment/payment.component';
import { isUserAuthenticated } from '../../shared/guards/auth.guard';

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
        canActivate: [isUserAuthenticated],
    },
    {
        path: 'payment',
        component: PaymentComponent,
        title: 'Payment - OneMobile',
        canActivate: [isUserAuthenticated],
    },
    { path: '', redirectTo: 'cart', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrderRoutingModule {}
