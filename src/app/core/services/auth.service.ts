import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'company' | 'admin';
  isVerified?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:5000/api/auth';

  currentUser = signal<AuthUser | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): AuthUser | null {
    try {
      const u = localStorage.getItem('internhub_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  }

  get token(): string | null {
    return localStorage.getItem('internhub_token');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get role(): string | null {
    return this.currentUser()?.role ?? null;
  }

  registerStudent(data: any): Observable<any> {
    return this.http.post(`${this.API}/register/student`, data).pipe(
      tap((res: any) => this.saveSession(res))
    );
  }

  registerCompany(data: any): Observable<any> {
    return this.http.post(`${this.API}/register/company`, data).pipe(
      tap((res: any) => this.saveSession(res))
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.API}/login`, data).pipe(
      tap((res: any) => this.saveSession(res))
    );
  }

  private saveSession(res: any): void {
    localStorage.setItem('internhub_token', res.token);
    localStorage.setItem('internhub_user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  logout(): void {
    localStorage.removeItem('internhub_token');
    localStorage.removeItem('internhub_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  redirectByRole(): void {
    const role = this.role;
    if (role === 'student')  this.router.navigate(['/student/feed']);
    else if (role === 'company') this.router.navigate(['/company/dashboard']);
    else if (role === 'admin')   this.router.navigate(['/admin/dashboard']);
    else this.router.navigate(['/login']);
  }
}
