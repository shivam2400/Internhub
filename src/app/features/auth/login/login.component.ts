import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card slide-up">
        <div class="auth-logo">🚀 InternHub</div>
        <div class="auth-subtitle">Your gateway to exciting internships</div>
        <h2 class="auth-title">Welcome Back</h2>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email Address</label>
            <input class="form-control" type="email" [(ngModel)]="form.email" name="email"
              placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <div style="position:relative">
              <input class="form-control" [type]="showPass ? 'text' : 'password'"
                [(ngModel)]="form.password" name="password" placeholder="••••••••" required />
              <span (click)="showPass=!showPass"
                style="position:absolute;right:1rem;top:50%;transform:translateY(-50%);cursor:pointer;color:var(--text-muted);font-size:1.1rem;">
                {{ showPass ? '🙈' : '👁' }}
              </span>
            </div>
          </div>
          <button class="btn btn-primary btn-lg" style="width:100%;justify-content:center" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account?
            <a routerLink="/register/student">Join as Student</a> or
            <a routerLink="/register/company">Register Company</a>
          </p>
          <div style="margin-top:1rem;padding:0.75rem;background:rgba(99,102,241,0.08);border-radius:8px;font-size:0.8rem;color:var(--text-muted);text-align:left">
            <strong style="color:var(--accent-light)">Demo Credentials:</strong><br/>
            👨‍🎓 Student: student&#64;demo.com / Student&#64;123<br/>
            🏢 Company: demo&#64;techcorp.com / Company&#64;123<br/>
            🔑 Admin: admin&#64;internhub.com / Admin&#64;123456
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  form = { email: '', password: '' };
  error = '';
  loading = false;
  showPass = false;

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn) this.auth.redirectByRole();
  }

  onSubmit(): void {
    this.error = '';
    this.loading = true;
    this.auth.login(this.form).subscribe({
      next: () => this.auth.redirectByRole(),
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
