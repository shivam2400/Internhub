import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ShellComponent],
  template: `
    <app-shell [navItems]="navItems">
      <div class="fade-in" style="max-width:680px">
        <div style="margin-bottom:2rem">
          <h1 class="page-title">Company Profile 🏢</h1>
          <p class="page-subtitle">Update your company information</p>
        </div>

        <div class="alert alert-success" *ngIf="success">{{ success }}</div>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div *ngIf="loading" class="spinner"></div>

        <div class="card" *ngIf="!loading">
          <div style="display:flex;align-items:center;gap:1.5rem;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid var(--border)">
            <div style="width:72px;height:72px;border-radius:var(--radius-sm);background:linear-gradient(135deg,var(--accent),#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:#fff">
              {{ profile.companyName?.charAt(0) }}
            </div>
            <div>
              <div style="font-size:1.25rem;font-weight:700">{{ profile.companyName }}</div>
              <div style="color:var(--text-muted);font-size:0.9rem">{{ profile.email }}</div>
              <div style="margin-top:0.4rem;display:flex;gap:0.5rem">
                <span class="badge badge-verified" *ngIf="profile.isVerified">✓ Verified</span>
                <span class="badge badge-unverified" *ngIf="!profile.isVerified">⏳ Pending Verification</span>
              </div>
            </div>
          </div>

          <form (ngSubmit)="onSubmit()">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
              <div class="form-group">
                <label>Company Name</label>
                <input class="form-control" [(ngModel)]="profile.companyName" name="companyName" />
              </div>
              <div class="form-group">
                <label>Industry</label>
                <input class="form-control" [(ngModel)]="profile.industry" name="industry" />
              </div>
              <div class="form-group">
                <label>Website</label>
                <input class="form-control" [(ngModel)]="profile.website" name="website" placeholder="https://..." />
              </div>
              <div class="form-group">
                <label>Contact Person</label>
                <input class="form-control" [(ngModel)]="profile.contactPerson" name="contactPerson" />
              </div>
            </div>
            <div class="form-group">
              <label>Company Bio</label>
              <textarea class="form-control" [(ngModel)]="profile.bio" name="bio"
                placeholder="Tell students about your company culture and mission..."></textarea>
            </div>
            <button class="btn btn-primary" type="submit" [disabled]="saving">
              {{ saving ? 'Saving...' : 'Update Profile' }}
            </button>
          </form>
        </div>
      </div>
    </app-shell>
  `
})
export class CompanyProfileComponent implements OnInit {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/company/dashboard' },
    { label: 'Company Profile', icon: 'business', route: '/company/profile' },
  ];

  profile: any = {};
  loading = false;
  saving = false;
  success = '';
  error = '';

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    this.loading = true;
    this.api.getCompanyProfile().subscribe({
      next: (data) => { this.profile = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSubmit() {
    this.saving = true;
    this.success = '';
    this.error = '';
    this.api.updateCompanyProfile(this.profile).subscribe({
      next: (data) => {
        this.profile = data;
        const user = this.auth.currentUser();
        if (user) this.auth.currentUser.set({ ...user, name: data.companyName });
        this.saving = false;
        this.success = '✅ Profile updated successfully!';
      },
      error: (err) => { this.error = err.error?.message || 'Update failed'; this.saving = false; }
    });
  }
}
