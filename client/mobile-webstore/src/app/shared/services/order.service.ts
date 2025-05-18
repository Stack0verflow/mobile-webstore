import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    baseUrl: string = environment.apiBaseUrl;
    headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
    });

    constructor(private http: HttpClient) {}

    makeOrder(
        user: User,
        contact: { email: string; phone: string },
        products: string[],
        shippingAddress: {
            firstName: string;
            lastName: string;
            country: string;
            city: string;
            zip: string;
            street: string;
            houseNumber: string;
        },
        shippingMethod: string,
        billingAddress: {
            firstName: string;
            lastName: string;
            country: string;
            city: string;
            zip: string;
            street: string;
            houseNumber: string;
        },
        paymentMethod: string,
        total: number
    ) {
        const body = new URLSearchParams();
        body.set('user', JSON.stringify(user));
        body.set('contact', JSON.stringify(contact));
        body.set('products', JSON.stringify(products));
        body.set('shippingAddress', JSON.stringify(shippingAddress));
        body.set('shippingMethod', shippingMethod);
        body.set('billingAddress', JSON.stringify(billingAddress));
        body.set('paymentMethod', paymentMethod);
        body.set('total', total.toString());

        return this.http.post<any>(this.baseUrl + '/order/create', body, {
            headers: this.headers,
            withCredentials: true,
        });
    }
}
