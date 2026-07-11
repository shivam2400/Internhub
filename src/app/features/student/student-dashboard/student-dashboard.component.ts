import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, ShellComponent],
  template: `
    <app-shell [navItems]="navItems">
      <div class="fade-in">
        <div style="margin-bottom:2rem">
          <h1 class="page-title">My Applications 📋</h1>
          <p class="page-subtitle">Track the status of your internship applications</p>
        </div>

        <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <div class="card" style="flex:1;min-width:160px;text-align:center">
            <div style="font-size:2rem;font-weight:800;color:var(--text-primary)">{{ total }}</div>
            <div style="color:var(--text-muted);font-size:0.85rem">Total Applied</div>
          </div>
          <div class="card" style="flex:1;min-width:160px;text-align:center">
            <div style="font-size:2rem;font-weight:800;color:var(--warning)">{{ pending }}</div>
            <div style="color:var(--text-muted);font-size:0.85rem">Pending</div>
          </div>
          <div class="card" style="flex:1;min-width:160px;text-align:center">
            <div style="font-size:2rem;font-weight:800;color:var(--success)">{{ accepted }}</div>
            <div style="color:var(--text-muted);font-size:0.85rem">Accepted</div>
          </div>
          <div class="card" style="flex:1;min-width:160px;text-align:center">
            <div style="font-size:2rem;font-weight:800;color:var(--danger)">{{ rejected }}</div>
            <div style="color:var(--text-muted);font-size:0.85rem">Rejected</div>
          </div>
        </div>

        <div *ngIf="loading" class="spinner"></div>

        <div *ngIf="!loading && applications.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>No applications yet</h3>
          <p>Browse internships and start applying!</p>
        </div>

        <div class="table-wrapper" *ngIf="!loading && applications.length > 0">
          <table>
            <thead>
              <tr>
                <th>Internship</th>
                <th>Company</th>
                <th>Role</th>
                <th>Location</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let app of applications">
                <td><strong>{{ app.internship?.title }}</strong></td>
                <td>{{ app.internship?.company?.companyName }}</td>
                <td>{{ app.internship?.role }}</td>
                <td>{{ app.internship?.location }}</td>
                <td>{{ app.createdAt | date:'mediumDate' }}</td>
                <td>
                  <span class="badge"
                    [class.badge-pending]="app.status==='Pending'"
                    [class.badge-accepted]="app.status==='Accepted'"
                    [class.badge-rejected]="app.status==='Rejected'">
                    {{ app.status }}
                  </span>
                </td>
                <td>
                  <a [href]="'http://localhost:5000' + app.resumeUrl" target="_blank"
                    class="btn btn-outline btn-sm">
                    View PDF
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-shell>
  `
})
export class StudentDashboardComponent implements OnInit {
  navItems = [
    { label: 'Browse Internships', icon: 'explore', route: '/student/feed' },
    { label: 'My Applications', icon: 'assignment', route: '/student/dashboard' },
    { label: 'My Profile', icon: 'person', route: '/student/profile' },
  ];

  applications: any[] = [];
  loading = false;

  get total()    { return this.applications.length; }
  get pending()  { return this.applications.filter(a => a.status === 'Pending').length; }
  get accepted() { return this.applications.filter(a => a.status === 'Accepted').length; }
  get rejected() { return this.applications.filter(a => a.status === 'Rejected').length; }

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loading = true;
    this.api.getMyApplications().subscribe({
      next: (data) => { this.applications = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
