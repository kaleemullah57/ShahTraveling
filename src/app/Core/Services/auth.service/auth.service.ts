import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../Environment/environment/environment';

import { LoginRequest } from '../../Models/login-request';
import { LoginResponse } from '../../Models/login-response';
import { User } from '../../Models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/Auth`;

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request
    );
  }

  saveLogin(user: User): void {

    localStorage.setItem(
      'token',
      user.token
    );

    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );
  }

  getToken(): string | null {

    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {

    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user) as User;
  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }
}