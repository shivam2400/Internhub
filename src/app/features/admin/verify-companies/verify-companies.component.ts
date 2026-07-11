import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-verify-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, ShellComponent],
  template: `
    <app-shell [navItems]="navItems">
      <div class="fade-in">
        <div style="margin-bottom:2rem">
          <h1 class="page-title">Company Verification 🔍</h1>
          <p class="page-subtitle">Review and verify company registrations</p>
        </div>

        <div *ngIf="loading" class="spinner"></div>

        <div *ngIf="!loading && companies.length === 0" class="empty-state">
          <div class="empty-icon">✅</div>
          <h3>All caught up!</h3>
          <p>No companies pending verification</p>
        </div>

        <div class="grid-2" *ngIf="!loading">
          <div class="card" *ngFor="let c of companies">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem">
              <div style="display:flex;gap:0.75rem;align-items:center">
                <div style="width:48px;height:48px;border-radius:8px;background:linear-gradient(135deg,var(--accent),#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:800;color:#fff">
                  {{ c.companyName?.charAt(0) }}
                </div>
                <div>
                  <div style="font-weight:700">{{ c.companyName }}</div>
                  <div style="font-size:0.8rem;color:var(--text-muted)">{{ c.industry }}</div>
                </div>
              </div>
              <span class="badge" [class.badge-verified]="c.isVerified" [class.badge-unverified]="!c.isVerified">
                {{ c.isVerified ? '✓ Verified' : '⏳ Pending' }}
              </span>
            </div>

            <div style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:0.75rem">
              <div>📧 {{ c.email }}</div>
              <div *ngIf="c.website">🌐 <a [href]="c.website" target="_blank">{{ c.website }}</a></div>
              <div>👤 {{ c.contactPerson }}</div>
              <div>📅 Registered {{ c.createdAt | date:'mediumDate' }}</div>
            </div>

            <p *ngIf="c.bio" style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem;
              display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
              {{ c.bio }}
            </p>

            <div style="display:flex;gap:0.75rem">
              <button class="btn btn-success btn-sm" *ngIf="!c.isVerified" (click)="toggle(c)">
                ✓ Verify Company
              </button>
              <button class="btn btn-danger btn-sm" *ngIf="c.isVerified" (click)="toggle(c)">
                Revoke Verification
              </button>
              <button class="btn btn-danger btn-sm" (click)="delete(c)">🗑 Delete</button>
            </div>
          </div>
        </div>
      </div>
    </app-shell>
  `
})
export class VerifyCompaniesComponent implements OnInit {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Verify Companies', icon: 'verified', route: '/admin/verify' },
    { label: 'Students', icon: 'school', route: '/admin/students' },
    { label: 'Companies', icon: 'business', route: '/admin/companies' },
  ];

  companies: any[] = [];
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getAllCompanies().subscribe({
      next: (data) => { this.companies = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  toggle(c: any) {
    this.api.toggleCompanyVerification(c._id).subscribe({
      next: (res) => { c.isVerified = res.company.isVerified; }
    });
  }

  delete(c: any) {
    if(!confirm(`Delete ${c.companyName}?`)) return;
    this.api.deleteCompany(c._id).subscribe({ next: () => this.load() });
  }
}
