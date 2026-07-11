import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card slide-up">
        <div class="auth-logo">🚀 InternHub</div>
        <div class="auth-subtitle">Start your internship journey today</div>
        <h2 class="auth-title">Create Student Account</h2>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="alert alert-success" *ngIf="success">{{ success }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input class="form-control" type="text" [(ngModel)]="form.name" name="name"
              placeholder="John Doe" required />
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input class="form-control" type="email" [(ngModel)]="form.email" name="email"
              placeholder="john@university.edu" required />
          </div>
          <div class="form-group">
            <label>University / College</label>
            <input class="form-control" type="text" [(ngModel)]="form.university" name="university"
              placeholder="State University of Technology" />
          </div>
          <div class="form-group">
            <label>Skills (comma separated)</label>
            <input class="form-control" type="text" [(ngModel)]="form.skills" name="skills"
              placeholder="JavaScript, React, Python" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input class="form-control" type="password" [(ngModel)]="form.password" name="password"
              placeholder="Min. 6 characters" required minlength="6" />
          </div>
          <button class="btn btn-primary btn-lg" style="width:100%;justify-content:center" [disabled]="loading">
            {{ loading ? 'Creating Account...' : 'Create Student Account' }}
          </button>
        </form>
        <div class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a><br/>
          Registering a company? <a routerLink="/register/company">Register here</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterStudentComponent {
  form = { name: '', email: '', university: '', skills: '', password: '' };
  error = '';
  success = '';
  loading = false;

  constructor(private auth: AuthService) {}

  onSubmit(): void {
    this.error = '';
    this.loading = true;
    this.auth.registerStudent(this.form).subscribe({
      next: () => this.auth.redirectByRole(),
      error: (err) => {
        this.error = err.error?.message || 'Registration failed.';
        this.loading = false;
      }
    });
  }
}
