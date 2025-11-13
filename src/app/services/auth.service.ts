import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../interfaces/user.interface';
import { GenericHttpService } from './generic-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private _service: GenericHttpService<any>) {
    this.loadUserFromStorage();
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this._service.post('auth/login', loginData as any)
      .pipe(
        tap(
          response => {
            this.setAuthData(response);
          }
        )
      );
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this._service.post('auth/register', registerData as any)
      .pipe(
        tap(
          response => {
            this.setAuthData(response);
          }
        )
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('current_user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem('current_user');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }
}
