import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  login(username: string, password: string): Observable<string> {
    return this.http.post('http://localhost:8080/auth/login', { username, password }, { responseType: 'text' }).pipe(
      tap(res => {
        this.token = res;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', res);
        }
      })
    );
  }

  logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
}