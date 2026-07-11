import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ShellComponent],
  template: `
    <app-shell [navItems]="navItems">
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;flex-wrap:wrap;gap:1rem">
          <div>
            <h1 class="page-title">Manage Students 👨‍🎓</h1>
            <p class="page-subtitle">{{ students.length }} registered students</p>
          </div>
          <div class="search-bar" style="width:280px">
            <span class="material-icons search-icon">search</span>
            <input type="text" [(ngModel)]="search" (input)="onSearch()" placeholder="Search by name, email, university..." />
          </div>
        </div>

        <div *ngIf="loading" class="spinner"></div>

        <div *ngIf="!loading && students.length===0" class="empty-state">
          <div class="empty-icon">🔍</div><h3>No students found</h3>
        </div>

        <div class="table-wrapper" *ngIf="!loading && students.length">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>University</th><th>Skills</th><th>Joined</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of students">
                <td>
                  <div style="display:flex;align-items:center;gap:0.6rem">
                    <div style="width:32px;height:32px;border-radius:50%;background:var(--accent-glow);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;color:var(--accent-light);flex-shrink:0">
                      {{ s.name?.charAt(0)?.toUpperCase() }}
                    </div>
                    <strong>{{ s.name }}</strong>
                  </div>
                </td>
                <td style="color:var(--text-secondary)">{{ s.email }}</td>
                <td>{{ s.university || '—' }}</td>
                <td>
                  <span class="skill-tag" *ngFor="let sk of s.skills?.slice(0,3)">{{ sk }}</span>
                  <span *ngIf="s.skills?.length > 3" style="color:var(--text-muted);font-size:0.8rem"> +{{ s.skills.length - 3 }}</span>
                </td>
                <td style="color:var(--text-muted)">{{ s.createdAt | date:'mediumDate' }}</td>
                <td>
                  <button class="btn btn-danger btn-sm" (click)="deleteStudent(s)">🗑 Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </app-shell>
  `
})
export class AdminStudentsComponent implements OnInit {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Verify Companies', icon: 'verified', route: '/admin/verify' },
    { label: 'Students', icon: 'school', route: '/admin/students' },
    { label: 'Companies', icon: 'business', route: '/admin/companies' },
  ];

  students: any[] = [];
  loading = false;
  search = '';

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getAllStudents(this.search).subscribe({
      next: (data) => { this.students = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() { this.load(); }

  deleteStudent(s: any) {
    if (!confirm(`Delete student ${s.name}?`)) return;
    this.api.deleteUser(s._id).subscribe({ next: () => this.load() });
  }
}
