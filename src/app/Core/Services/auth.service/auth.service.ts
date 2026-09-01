import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { LoginRequest } from '../../Models/login-request';
import { LoginResponse } from '../../Models/login-response';
import { User } from '../../Models/user';

interface JwtPayload {
  BranchId?: number | string;
  branchId?: number | string;
  BranchID?: number | string;
  branchID?: number | string;

  UserId?: number | string;
  userId?: number | string;

  RoleId?: number | string;
  roleId?: number | string;

  exp?: number;

  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/Auth`;


  // ==========================================
  // LOGIN
  // ==========================================

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request
    );
  }


  // ==========================================
  // SAVE LOGIN
  // ==========================================

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


  // ==========================================
  // GET TOKEN
  // ==========================================

  getToken(): string | null {

    return localStorage.getItem('token');
  }


  // ==========================================
  // GET CURRENT USER
  // ==========================================

  getCurrentUser(): User | null {

    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {

      return JSON.parse(user) as User;

    } catch (error) {

      console.error('Invalid user data in localStorage.', error);

      return null;
    }
  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }


  // ==========================================
  // CHECK LOGIN
  // ==========================================

  isLoggedIn(): boolean {

    return !!this.getToken();
  }


  // ==========================================
  // GET USER NAME
  // ==========================================

  getUserName(): string {

    const user = this.getCurrentUser();

    return user?.userName ?? '';
  }


  // ==========================================
  // GET USER EMAIL
  // ==========================================

  getUserEmail(): string {

    const user = this.getCurrentUser();

    return user?.email ?? '';
  }


  // ==========================================
  // GET USER ID
  // ==========================================

  getUserId(): number | null {

    const user = this.getCurrentUser();

    return user?.userID ?? null;
  }


  // ==========================================
  // GET USER TYPE
  // ==========================================

  getUserType(): string {

    const user = this.getCurrentUser();

    return user?.userType ?? '';
  }


  // ==========================================
  // DECODE JWT
  // ==========================================

  private getDecodedToken(): any | null {

    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {

      const payload = token.split('.')[1];

      if (!payload) {
        return null;
      }

      const base64 = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const decodedPayload = atob(base64);

      return JSON.parse(decodedPayload);

    } catch (error) {

      console.error('Unable to decode JWT token.', error);

      return null;
    }
  }


  // ==========================================
  // GET BRANCH ID FROM JWT
  // ==========================================

  getBranchId(): number {

    const token = this.getDecodedToken();

    if (!token) {
      return 0;
    }

    return Number(
      token.BranchId ??
      token.branchId ??
      token.BranchID ??
      token.branchID ??
      0
    );
  }
}