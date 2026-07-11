import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ShellComponent],
  template: `
    <app-shell [navItems]="navItems">
      <div class="fade-in">
        <div style="margin-bottom:2rem">
          <h1 class="page-title">Admin Control Center 🔑</h1>
          <p class="page-subtitle">Overview of the InternHub platform</p>
        </div>

        <div *ngIf="loading" class="spinner"></div>

        <div class="grid-4" *ngIf="!loading && stats" style="margin-bottom:2rem">
          <div class="stat-card">
            <div class="stat-icon">👨‍🎓</div>
            <div><div class="stat-value">{{ stats.totalStudents }}</div><div class="stat-label">Total Students</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏢</div>
            <div><div class="stat-value">{{ stats.totalCompanies }}</div><div class="stat-label">Companies</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💼</div>
            <div><div class="stat-value">{{ stats.totalInternships }}</div><div class="stat-label">Internships Posted</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div><div class="stat-value">{{ stats.totalApplications }}</div><div class="stat-label">Applications</div></div>
          </div>
        </div>

        <!-- Pending Verification Alert -->
        <div class="alert alert-info" *ngIf="stats?.pendingVerification > 0" style="margin-bottom:1.5rem">
          ⚠️ <strong>{{ stats.pendingVerification }} companies</strong> are awaiting verification.
          <a routerLink="/admin/verify" style="margin-left:0.5rem;font-weight:600">Review now →</a>
        </div>

        <!-- Students Table -->
        <div style="margin-bottom:2rem">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <h2 style="font-size:1.15rem;font-weight:700">Recent Students</h2>
          </div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>University</th><th>Skills</th><th>Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of recentStudents">
                  <td><strong>{{ s.name }}</strong></td>
                  <td style="color:var(--text-secondary)">{{ s.email }}</td>
                  <td>{{ s.university || '—' }}</td>
                  <td><span class="skill-tag" *ngFor="let sk of s.skills?.slice(0,2)">{{ sk }}</span></td>
                  <td style="color:var(--text-muted)">{{ s.createdAt | date:'mediumDate' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Companies Table -->
        <div>
          <h2 style="font-size:1.15rem;font-weight:700;margin-bottom:1rem">Recent Companies</h2>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr><th>Company</th><th>Industry</th><th>Email</th><th>Status</th><th>Joined</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of recentCompanies">
                  <td><strong>{{ c.companyName }}</strong></td>
                  <td>{{ c.industry || '—' }}</td>
                  <td style="color:var(--text-secondary)">{{ c.email }}</td>
                  <td>
                    <span class="badge" [class.badge-verified]="c.isVerified" [class.badge-unverified]="!c.isVerified">
                      {{ c.isVerified ? '✓ Verified' : '⏳ Pending' }}
                    </span>
                  </td>
                  <td style="color:var(--text-muted)">{{ c.createdAt | date:'mediumDate' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </app-shell>
  `
})
export class AdminDashboardComponent implements OnInit {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Verify Companies', icon: 'verified', route: '/admin/verify' },
    { label: 'Students', icon: 'school', route: '/admin/students' },
    { label: 'Companies', icon: 'business', route: '/admin/companies' },
  ];

  stats: any = null;
  recentStudents: any[] = [];
  recentCompanies: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    Promise.all([
      this.api.getAdminStats().toPromise(),
      this.api.getAllStudents().toPromise(),
      this.api.getAllCompanies().toPromise(),
    ]).then(([stats, students, companies]: any[]) => {
      this.stats = stats;
      this.recentStudents = students?.slice(0, 5) || [];
      this.recentCompanies = companies?.slice(0, 5) || [];
      this.loading = false;
    }).catch(() => { this.loading = false; });
  }
}
