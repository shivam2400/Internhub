import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ShellComponent],
  template: `
    <app-shell [navItems]="navItems">
      <div class="fade-in" style="max-width:680px">
        <div style="margin-bottom:2rem">
          <h1 class="page-title">My Profile 👤</h1>
          <p class="page-subtitle">Manage your public profile and skills</p>
        </div>

        <div class="alert alert-success" *ngIf="success">{{ success }}</div>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div *ngIf="loading" class="spinner"></div>

        <div class="card" *ngIf="!loading">
          <div style="display:flex;align-items:center;gap:1.5rem;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid var(--border)">
            <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:#fff;flex-shrink:0">
              {{ profile.name?.charAt(0)?.toUpperCase() }}
            </div>
            <div>
              <div style="font-size:1.25rem;font-weight:700">{{ profile.name }}</div>
              <div style="color:var(--text-muted);font-size:0.9rem">{{ profile.email }}</div>
              <span class="badge badge-accent" style="margin-top:0.25rem">Student</span>
            </div>
          </div>

          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Full Name</label>
              <input class="form-control" type="text" [(ngModel)]="profile.name" name="name" />
            </div>
            <div class="form-group">
              <label>University / College</label>
              <input class="form-control" type="text" [(ngModel)]="profile.university" name="university"
                placeholder="Your university name" />
            </div>
            <div class="form-group">
              <label>Bio</label>
              <textarea class="form-control" [(ngModel)]="profile.bio" name="bio"
                placeholder="Tell companies about yourself..."></textarea>
            </div>
            <div class="form-group">
              <label>Skills (comma separated)</label>
              <input class="form-control" type="text" [(ngModel)]="skillsInput" name="skills"
                placeholder="JavaScript, React, Python, SQL" />
              <div class="skill-tags" style="margin-top:0.5rem" *ngIf="skillsInput">
                <span class="skill-tag" *ngFor="let s of skillsInput.split(',')">{{ s.trim() }}</span>
              </div>
            </div>
            <button class="btn btn-primary" type="submit" [disabled]="saving">
              {{ saving ? 'Saving...' : 'Save Profile' }}
            </button>
          </form>
        </div>
      </div>
    </app-shell>
  `
})
export class StudentProfileComponent implements OnInit {
  navItems = [
    { label: 'Browse Internships', icon: 'explore', route: '/student/feed' },
    { label: 'My Applications', icon: 'assignment', route: '/student/dashboard' },
    { label: 'My Profile', icon: 'person', route: '/student/profile' },
  ];

  profile: any = {};
  skillsInput = '';
  loading = false;
  saving = false;
  success = '';
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loading = true;
    this.api.getStudentProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.skillsInput = data.skills?.join(', ') || '';
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSubmit() {
    this.saving = true;
    this.success = '';
    this.error = '';
    const payload = { ...this.profile, skills: this.skillsInput };
    this.api.updateStudentProfile(payload).subscribe({
      next: (data) => { this.profile = data; this.saving = false; this.success = '✅ Profile updated!'; },
      error: (err) => { this.error = err.error?.message || 'Update failed'; this.saving = false; }
    });
  }
}
