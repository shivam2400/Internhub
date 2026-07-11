import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card slide-up">
        <div class="auth-logo">🚀 InternHub</div>
        <div class="auth-subtitle">Find talented interns for your team</div>
        <h2 class="auth-title">Register Your Company</h2>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="alert alert-info" *ngIf="!error">
          ℹ️ Your account will be reviewed and verified by our admin team.
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Company Name</label>
            <input class="form-control" type="text" [(ngModel)]="form.companyName" name="companyName"
              placeholder="Acme Inc." required />
          </div>
          <div class="form-group">
            <label>Work Email</label>
            <input class="form-control" type="email" [(ngModel)]="form.email" name="email"
              placeholder="hr@company.com" required />
          </div>
          <div class="form-group">
            <label>Industry</label>
            <select class="form-control" [(ngModel)]="form.industry" name="industry">
              <option value="">Select Industry</option>
              <option *ngFor="let i of industries" [value]="i">{{ i }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Company Website</label>
            <input class="form-control" type="url" [(ngModel)]="form.website" name="website"
              placeholder="https://company.com" />
          </div>
          <div class="form-group">
            <label>Contact Person Name</label>
            <input class="form-control" type="text" [(ngModel)]="form.contactPerson" name="contactPerson"
              placeholder="HR Manager Name" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input class="form-control" type="password" [(ngModel)]="form.password" name="password"
              placeholder="Min. 6 characters" required minlength="6" />
          </div>
          <button class="btn btn-primary btn-lg" style="width:100%;justify-content:center" [disabled]="loading">
            {{ loading ? 'Registering...' : 'Register Company' }}
          </button>
        </form>
        <div class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a><br/>
          Looking for internships? <a routerLink="/register/student">Join as Student</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterCompanyComponent {
  form = { companyName: '', email: '', industry: '', website: '', contactPerson: '', password: '' };
  error = '';
  loading = false;
  industries = ['Software Development', 'Finance & Banking', 'Healthcare', 'E-Commerce', 'EdTech', 'Marketing', 'Design', 'Data & Analytics', 'Consulting', 'Other'];

  constructor(private auth: AuthService) {}

  onSubmit(): void {
    this.error = '';
    this.loading = true;
    this.auth.registerCompany(this.form).subscribe({
      next: () => this.auth.redirectByRole(),
      error: (err) => {
        this.error = err.error?.message || 'Registration failed.';
        this.loading = false;
      }
    });
  }
}
