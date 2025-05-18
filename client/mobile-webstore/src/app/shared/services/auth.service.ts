import { Injectable } from '@angular/core';
import { User } from '../interfaces/User';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    baseUrl: string = environment.apiBaseUrl;
    headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
    });

    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<User> {
        const body = new URLSearchParams();
        body.set('username', email);
        body.set('password', password);

        return this.http.post<User>(this.baseUrl + '/login', body, {
            headers: this.headers,
            withCredentials: true,
        });
    }

    signup(
        email: string,
        password: string,
        confirmationPassword: string
    ): Observable<User> {
        const body = new URLSearchParams();
        body.set('email', email);
        body.set('password', password);
        body.set('confirmPassword', confirmationPassword);

        return this.http.post<User>(this.baseUrl + '/signup', body, {
            headers: this.headers,
            withCredentials: true,
        });
    }

    logout(): Observable<any> {
        return this.http.get<any>(this.baseUrl + '/logout', {
            headers: this.headers,
            withCredentials: true,
        });
    }

    getCurrentUser(): Observable<User> {
        return this.http.get<User>(this.baseUrl + '/get-user', {
            headers: this.headers,
            withCredentials: true,
        });
    }

    isUserAdmin(): Observable<boolean> {
        const user = localStorage.getItem('current-user');
        if (user) {
            const body = new URLSearchParams();
            body.set('user', user);

            return this.http.post<boolean>(this.baseUrl + '/admin-auth', body, {
                headers: this.headers,
                withCredentials: true,
            });
        } else {
            return of(false);
        }
    }
}
