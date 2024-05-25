import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Login } from '../models/login.model';
import { ApiUrl } from './api-url';
import { DataSharedService } from './data-shared.service';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  URL = new ApiUrl().URL;

  loginData!: Login;

  nameKeyStorage = 'loginData:AgileMovies';

  constructor(private http: HttpClient, private dataShared: DataSharedService, private router: Router) {
    // al iniciar obtengo los datos de usuario desde el localstorage
    this.loginData = JSON.parse(localStorage.getItem(this.nameKeyStorage) || '{}');
  }

  public isAuthenticated(): boolean {
    const loginData = localStorage.getItem(this.nameKeyStorage);
    return !!(loginData && JSON.parse(loginData));
  }

  login(body: {username: string, password: string}): Observable<void> {
    return this.http.post(this.URL + '/auth/login', body).pipe(
      map(({data}: any) => {
        this.loginData = data;
        this.dataShared.user = data?.user || {};
        localStorage.setItem(this.nameKeyStorage, JSON.stringify(this.loginData));
        this.router.navigate(['/home']);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.nameKeyStorage);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<any> {
    return this.http.post(this.URL + '/auth/refresh', {refresh_token: this.loginData.payload.refresh_token});
  }

  setLocalStorage(data: any): void {
    this.loginData.user = data.user;
    this.loginData.payload.token = data.payload.token;
    localStorage.setItem(this.nameKeyStorage, JSON.stringify(this.loginData));
  }

}
