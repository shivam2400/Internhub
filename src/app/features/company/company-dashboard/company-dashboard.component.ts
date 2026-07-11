import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ShellComponent],
  template: `
    <app-shell [navItems]="navItems">
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2rem;flex-wrap:wrap;gap:1rem">
          <div>
            <h1 class="page-title">Company Dashboard 🏢</h1>
            <p class="page-subtitle">Manage your internship postings and applicants</p>
          </div>
          <button class="btn btn-primary" (click)="showPostModal=true">
            <span class="material-icons">add</span> Post New Internship
          </button>
        </div>

        <div style="display:flex;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap">
          <div class="card" style="flex:1;min-width:140px;text-align:center">
            <div style="font-size:2rem;font-weight:800">{{ internships.length }}</div>
            <div style="color:var(--text-muted);font-size:0.85rem">Total Postings</div>
          </div>
          <div class="card" style="flex:1;min-width:140px;text-align:center">
            <div style="font-size:2rem;font-weight:800;color:var(--success)">{{ activeCount }}</div>
            <div style="color:var(--text-muted);font-size:0.85rem">Active</div>
          </div>
        </div>

        <div *ngIf="loading" class="spinner"></div>

        <div *ngIf="!loading && internships.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No internships posted yet</h3>
          <p>Create your first internship posting to start receiving applications</p>
        </div>

        <div class="grid-2" *ngIf="!loading">
          <div class="card" *ngFor="let i of internships" style="cursor:default">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem">
              <div>
                <div style="font-size:1.05rem;font-weight:700;margin-bottom:0.25rem">{{ i.title }}</div>
                <div style="font-size:0.85rem;color:var(--text-secondary)">{{ i.role }}</div>
              </div>
              <span class="badge" [class.badge-accepted]="i.isActive" [class.badge-rejected]="!i.isActive">
                {{ i.isActive ? 'Active' : 'Closed' }}
              </span>
            </div>

            <div class="internship-meta">
              <span class="meta-chip"><span class="material-icons">location_on</span>{{ i.location }}</span>
              <span class="meta-chip"><span class="material-icons">schedule</span>{{ i.duration }}</span>
              <span class="meta-chip"><span class="material-icons">payments</span>{{ i.stipend }}</span>
            </div>

            <div class="skill-tags" style="margin-bottom:1rem">
              <span class="skill-tag" *ngFor="let s of i.skills">{{ s }}</span>
            </div>

            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;padding-top:1rem;border-top:1px solid var(--border)">
              <button class="btn btn-outline btn-sm" (click)="viewApplicants(i)">
                <span class="material-icons" style="font-size:1rem">people</span> View Applicants
              </button>
              <button class="btn btn-outline btn-sm" (click)="editInternship(i)">
                <span class="material-icons" style="font-size:1rem">edit</span> Edit
              </button>
              <button class="btn btn-danger btn-sm" (click)="deleteInternship(i._id)">
                <span class="material-icons" style="font-size:1rem">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Post/Edit Modal -->
      <div class="modal-overlay" *ngIf="showPostModal" (click)="closePostModal()">
        <div class="modal" style="max-width:560px" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editMode ? 'Edit Internship' : 'Post New Internship' }}</h3>
            <span class="modal-close" (click)="closePostModal()">✕</span>
          </div>

          <div class="alert alert-error" *ngIf="postError">{{ postError }}</div>

          <form (ngSubmit)="submitPost()">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
              <div class="form-group">
                <label>Title</label>
                <input class="form-control" [(ngModel)]="postForm.title" name="title" placeholder="Frontend Developer Intern" required />
              </div>
              <div class="form-group">
                <label>Role</label>
                <input class="form-control" [(ngModel)]="postForm.role" name="role" placeholder="Frontend Developer" />
              </div>
              <div class="form-group">
                <label>Location</label>
                <input class="form-control" [(ngModel)]="postForm.location" name="location" placeholder="Remote / City" />
              </div>
              <div class="form-group">
                <label>Duration</label>
                <input class="form-control" [(ngModel)]="postForm.duration" name="duration" placeholder="3 months" />
              </div>
              <div class="form-group">
                <label>Stipend</label>
                <input class="form-control" [(ngModel)]="postForm.stipend" name="stipend" placeholder="₹15,000/month" />
              </div>
              <div class="form-group">
                <label>Openings</label>
                <input class="form-control" type="number" [(ngModel)]="postForm.openings" name="openings" min="1" />
              </div>
            </div>
            <div class="form-group">
              <label>Skills Required (comma separated)</label>
              <input class="form-control" [(ngModel)]="postForm.skills" name="skills" placeholder="React, Node.js, CSS" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea class="form-control" [(ngModel)]="postForm.description" name="description"
                placeholder="Describe the internship role and responsibilities..." required></textarea>
            </div>
            <div style="display:flex;gap:0.75rem;justify-content:flex-end">
              <button type="button" class="btn btn-outline" (click)="closePostModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="posting">
                {{ posting ? 'Saving...' : (editMode ? 'Update' : 'Post Internship') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Applicants Modal -->
      <div class="modal-overlay" *ngIf="applicantsModal" (click)="applicantsModal=false">
        <div class="modal" style="max-width:700px;max-height:80vh;overflow-y:auto" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Applicants — {{ selectedInternship?.title }}</h3>
            <span class="modal-close" (click)="applicantsModal=false">✕</span>
          </div>

          <div *ngIf="loadingApplicants" class="spinner"></div>
          <div *ngIf="!loadingApplicants && applicants.length === 0" class="empty-state" style="padding:2rem">
            <div class="empty-icon">👥</div>
            <h3>No applicants yet</h3>
          </div>

          <div *ngFor="let app of applicants" style="padding:1rem;border-bottom:1px solid var(--border)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem">
              <div>
                <div style="font-weight:600">{{ app.student?.name }}</div>
                <div style="font-size:0.85rem;color:var(--text-muted)">{{ app.student?.email }} · {{ app.student?.university }}</div>
                <div class="skill-tags" style="margin-top:0.5rem">
                  <span class="skill-tag" *ngFor="let s of app.student?.skills?.slice(0,4)">{{ s }}</span>
                </div>
              </div>
              <span class="badge"
                [class.badge-pending]="app.status==='Pending'"
                [class.badge-accepted]="app.status==='Accepted'"
                [class.badge-rejected]="app.status==='Rejected'">
                {{ app.status }}
              </span>
            </div>
            <div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap">
              <a [href]="'http://localhost:5000' + app.resumeUrl" target="_blank" class="btn btn-outline btn-sm">
                📄 View Resume
              </a>
              <button class="btn btn-success btn-sm" (click)="updateStatus(app, 'Accepted')">Accept</button>
              <button class="btn btn-danger btn-sm" (click)="updateStatus(app, 'Rejected')">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </app-shell>
  `
})
export class CompanyDashboardComponent implements OnInit {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/company/dashboard' },
    { label: 'Company Profile', icon: 'business', route: '/company/profile' },
  ];

  internships: any[] = [];
  loading = false;
  showPostModal = false;
  editMode = false;
  editId = '';
  posting = false;
  postError = '';
  applicantsModal = false;
  applicants: any[] = [];
  loadingApplicants = false;
  selectedInternship: any = null;

  postForm = { title: '', role: '', location: 'Remote', duration: '', stipend: '', openings: 1, skills: '', description: '' };

  get activeCount() { return this.internships.filter(i => i.isActive).length; }

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadInternships(); }

  loadInternships() {
    this.loading = true;
    this.api.getMyInternships().subscribe({
      next: (data) => { this.internships = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  closePostModal() {
    if (!this.posting) {
      this.showPostModal = false; this.editMode = false; this.editId = '';
      this.postForm = { title: '', role: '', location: 'Remote', duration: '', stipend: '', openings: 1, skills: '', description: '' };
      this.postError = '';
    }
  }

  editInternship(i: any) {
    this.editMode = true; this.editId = i._id;
    this.postForm = { title: i.title, role: i.role, location: i.location, duration: i.duration,
      stipend: i.stipend, openings: i.openings, skills: i.skills?.join(', '), description: i.description };
    this.showPostModal = true;
  }

  submitPost() {
    this.posting = true; this.postError = '';
    const obs = this.editMode
      ? this.api.updateInternship(this.editId, this.postForm)
      : this.api.createInternship(this.postForm);

    obs.subscribe({
      next: () => { this.closePostModal(); this.loadInternships(); this.posting = false; },
      error: (err) => { this.postError = err.error?.message || 'Failed to save'; this.posting = false; }
    });
  }

  deleteInternship(id: string) {
    if (!confirm('Delete this internship?')) return;
    this.api.deleteInternship(id).subscribe({ next: () => this.loadInternships() });
  }

  viewApplicants(i: any) {
    this.selectedInternship = i; this.applicantsModal = true; this.loadingApplicants = true;
    this.api.getApplicantsForInternship(i._id).subscribe({
      next: (data) => { this.applicants = data; this.loadingApplicants = false; },
      error: () => { this.loadingApplicants = false; }
    });
  }

  updateStatus(app: any, status: string) {
    this.api.updateApplicationStatus(app._id, status).subscribe({
      next: () => { app.status = status; }
    });
  }
}
