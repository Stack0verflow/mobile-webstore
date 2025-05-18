import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Model } from '../interfaces/Model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/Product';
import { User } from '../interfaces/User';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    baseUrl: string = environment.apiBaseUrl;
    headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
    });

    constructor(private http: HttpClient) {}

    getModel(uuid: string): Observable<Model> {
        const body = new URLSearchParams();
        body.set('uuid', uuid);

        return this.http.post<Model>(this.baseUrl + '/model/get-one', body, {
            headers: this.headers,
            withCredentials: true,
        });
    }

    getAllModels(): Observable<Model[]> {
        return this.http.get<Model[]>(this.baseUrl + '/model/get-all', {
            headers: this.headers,
            withCredentials: true,
        });
    }

    createModel(
        user: User,
        name: string,
        colors: string[],
        pictures: string[],
        brand: string,
        details: object,
        basePrice: number,
        storages: number[]
    ): Observable<any> {
        const body = new URLSearchParams();
        body.set('user', JSON.stringify(user));
        body.set('name', name);
        body.set('colors', JSON.stringify(colors));
        body.set('pictures', JSON.stringify(pictures));
        body.set('brand', brand);
        body.set('details', JSON.stringify(details));
        body.set('basePrice', basePrice.toString());
        body.set('storages', JSON.stringify(storages));

        return this.http.post<any>(this.baseUrl + '/model/create', body, {
            headers: this.headers,
            withCredentials: true,
        });
    }

    updateModel(
        user: User,
        uuid: string,
        name: string,
        colors: string[],
        pictures: string[],
        brand: string,
        details: object,
        basePrice: number,
        storages: number[]
    ): Observable<any> {
        const body = new URLSearchParams();
        body.set('user', JSON.stringify(user));
        body.set('uuid', uuid);
        body.set('name', name);
        body.set('colors', JSON.stringify(colors));
        body.set('pictures', JSON.stringify(pictures));
        body.set('brand', brand);
        body.set('details', JSON.stringify(details));
        body.set('basePrice', basePrice.toString());
        body.set('storages', JSON.stringify(storages));

        return this.http.post<any>(this.baseUrl + '/model/update', body, {
            headers: this.headers,
            withCredentials: true,
        });
    }

    deleteModel(user: User, uuid: string) {
        const body = new URLSearchParams();
        body.set('user', JSON.stringify(user));
        body.set('uuid', uuid);

        return this.http.post<any>(this.baseUrl + '/model/delete', body, {
            headers: this.headers,
            withCredentials: true,
        });
    }

    getProductBySerial(serial: string): Observable<Product> {
        const body = new URLSearchParams();
        body.set('serial', serial);

        return this.http.post<Product>(
            this.baseUrl + '/product/get-by-serial',
            body,
            {
                headers: this.headers,
                withCredentials: true,
            }
        );
    }

    getProductBySelection(
        model: string,
        color: string,
        storage: string
    ): Observable<Product> {
        const body = new URLSearchParams();
        body.set('model', model);
        body.set('color', color);
        body.set('storage', storage);

        return this.http.post<Product>(
            this.baseUrl + '/product/get-by-selection',
            body,
            {
                headers: this.headers,
                withCredentials: true,
            }
        );
    }

    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.baseUrl + '/product/get-all', {
            headers: this.headers,
            withCredentials: true,
        });
    }

    updateProduct(
        user: User,
        serial: string,
        price: number,
        warranty: number,
        quantity: number
    ) {
        const body = new URLSearchParams();
        body.set('user', JSON.stringify(user));
        body.set('serial', serial);
        body.set('price', price.toString());
        body.set('warranty', warranty.toString());
        body.set('quantity', quantity.toString());

        return this.http.post<any>(this.baseUrl + '/product/update', body, {
            headers: this.headers,
            withCredentials: true,
        });
    }
}
