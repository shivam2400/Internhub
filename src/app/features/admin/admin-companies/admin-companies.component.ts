import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, ShellComponent],
  template: `
    <app-shell [navItems]="navItems">
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;flex-wrap:wrap;gap:1rem">
          <div>
            <h1 class="page-title">Manage Companies 🏢</h1>
            <p class="page-subtitle">{{ companies.length }} registered companies</p>
          </div>
          <div class="search-bar" style="width:280px">
            <span class="material-icons search-icon">search</span>
            <input type="text" [(ngModel)]="search" (input)="onSearch()" placeholder="Search by name, industry, email..." />
          </div>
        </div>

        <div *ngIf="loading" class="spinner"></div>

        <div *ngIf="!loading && companies.length===0" class="empty-state">
          <div class="empty-icon">🔍</div><h3>No companies found</h3>
        </div>

        <div class="table-wrapper" *ngIf="!loading && companies.length">
          <table>
            <thead>
              <tr>
                <th>Company</th><th>Industry</th><th>Contact</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of companies">
                <td>
                  <div style="display:flex;align-items:center;gap:0.6rem">
                    <div style="width:32px;height:32px;border-radius:6px;background:linear-gradient(135deg,var(--accent),#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;color:#fff;flex-shrink:0">
                      {{ c.companyName?.charAt(0) }}
                    </div>
                    <strong>{{ c.companyName }}</strong>
                  </div>
                </td>
                <td>{{ c.industry || '—' }}</td>
                <td>{{ c.contactPerson || '—' }}</td>
                <td style="color:var(--text-secondary)">{{ c.email }}</td>
                <td>
                  <span class="badge" [class.badge-verified]="c.isVerified" [class.badge-unverified]="!c.isVerified">
                    {{ c.isVerified ? '✓ Verified' : '⏳ Pending' }}
                  </span>
                </td>
                <td style="color:var(--text-muted)">{{ c.createdAt | date:'mediumDate' }}</td>
                <td>
                  <div style="display:flex;gap:0.4rem">
                    <button class="btn btn-sm" [class.btn-success]="!c.isVerified" [class.btn-outline]="c.isVerified" (click)="toggle(c)">
                      {{ c.isVerified ? 'Revoke' : '✓ Verify' }}
                    </button>
                    <button class="btn btn-danger btn-sm" (click)="del(c)">🗑</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-shell>
  `
})
export class AdminCompaniesComponent implements OnInit {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Verify Companies', icon: 'verified', route: '/admin/verify' },
    { label: 'Students', icon: 'school', route: '/admin/students' },
    { label: 'Companies', icon: 'business', route: '/admin/companies' },
  ];

  companies: any[] = [];
  loading = false;
  search = '';

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getAllCompanies(this.search).subscribe({
      next: (data) => { this.companies = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() { this.load(); }

  toggle(c: any) {
    this.api.toggleCompanyVerification(c._id).subscribe({
      next: (res) => { c.isVerified = res.company.isVerified; }
    });
  }

  del(c: any) {
    if (!confirm(`Delete ${c.companyName}?`)) return;
    this.api.deleteCompany(c._id).subscribe({ next: () => this.load() });
  }
}
