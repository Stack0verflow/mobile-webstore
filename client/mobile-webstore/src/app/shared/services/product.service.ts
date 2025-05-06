import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Model } from '../interfaces/Model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/Product';

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
}
