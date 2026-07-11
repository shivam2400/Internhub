import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShellComponent } from '../../../shared/shell/shell.component';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-internship-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, ShellComponent],
  template: `
    <app-shell [navItems]="navItems">
      <div class="fade-in">
        <div style="margin-bottom:2rem">
          <h1 class="page-title">Find Your Internship ✨</h1>
          <p class="page-subtitle">Discover {{ totalCount }} opportunities waiting for you</p>
        </div>

        <!-- Filters -->
        <div class="card" style="margin-bottom:1.5rem">
          <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:1rem;align-items:end">
            <div class="form-group" style="margin:0">
              <label>Search</label>
              <div class="search-bar">
                <span class="material-icons search-icon">search</span>
                <input type="text" [(ngModel)]="filters.search" (input)="loadInternships()"
                  placeholder="Role, skill, keyword..." />
              </div>
            </div>
            <div class="form-group" style="margin:0">
              <label>Location</label>
              <input class="form-control" type="text" [(ngModel)]="filters.location"
                (input)="loadInternships()" placeholder="Remote, Mumbai..." />
            </div>
            <div class="form-group" style="margin:0">
              <label>Role</label>
              <input class="form-control" type="text" [(ngModel)]="filters.role"
                (input)="loadInternships()" placeholder="Frontend, Backend..." />
            </div>
            <div class="form-group" style="margin:0">
              <label>Duration</label>
              <input class="form-control" type="text" [(ngModel)]="filters.duration"
                (input)="loadInternships()" placeholder="3 months..." />
            </div>
            <button class="btn btn-outline" (click)="clearFilters()">Clear</button>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="spinner"></div>

        <!-- Empty State -->
        <div *ngIf="!loading && internships.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No internships found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>

        <!-- Internship Grid -->
        <div class="grid-3" *ngIf="!loading">
          <div class="internship-card" *ngFor="let i of internships" (click)="openApply(i)">
            <div class="company-header">
              <div class="company-logo">{{ i.company?.companyName?.charAt(0) }}</div>
              <div>
                <div class="company-name">{{ i.company?.companyName }}</div>
                <div class="company-industry">{{ i.company?.industry }}</div>
              </div>
              <span class="badge badge-verified" *ngIf="i.company?.isVerified" style="margin-left:auto">✓ Verified</span>
            </div>

            <div class="internship-title">{{ i.title }}</div>
            <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:0.75rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
              {{ i.description }}
            </p>

            <div class="internship-meta">
              <span class="meta-chip"><span class="material-icons">location_on</span>{{ i.location }}</span>
              <span class="meta-chip"><span class="material-icons">schedule</span>{{ i.duration }}</span>
              <span class="meta-chip"><span class="material-icons">people</span>{{ i.openings }} opening(s)</span>
            </div>

            <div class="skill-tags">
              <span class="skill-tag" *ngFor="let s of i.skills?.slice(0,3)">{{ s }}</span>
              <span class="skill-tag" *ngIf="i.skills?.length > 3">+{{ i.skills.length - 3 }}</span>
            </div>

            <div class="internship-footer">
              <span class="stipend">{{ i.stipend }}</span>
              <button class="btn btn-primary btn-sm" (click)="openApply(i); $event.stopPropagation()">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Apply Modal -->
      <div class="modal-overlay" *ngIf="applyModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Apply to {{ selectedInternship?.title }}</h3>
            <span class="modal-close" (click)="closeModal()">✕</span>
          </div>

          <div style="margin-bottom:1rem;padding:1rem;background:rgba(99,102,241,0.08);border-radius:8px;">
            <strong>{{ selectedInternship?.company?.companyName }}</strong> —
            <span style="color:var(--text-secondary)">{{ selectedInternship?.role }}</span>
          </div>

          <div class="alert alert-error" *ngIf="applyError">{{ applyError }}</div>
          <div class="alert alert-success" *ngIf="applySuccess">{{ applySuccess }}</div>

          <div class="form-group">
            <label>Resume (PDF only, max 5MB)</label>
            <input class="form-control" type="file" accept=".pdf" (change)="onFileChange($event)" />
          </div>
          <div class="form-group">
            <label>Cover Letter (optional)</label>
            <textarea class="form-control" [(ngModel)]="coverLetter"
              placeholder="Tell us why you're a great fit..."></textarea>
          </div>

          <div style="display:flex;gap:1rem;justify-content:flex-end">
            <button class="btn btn-outline" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="submitApplication()" [disabled]="applying || !resumeFile">
              {{ applying ? 'Submitting...' : 'Submit Application' }}
            </button>
          </div>
        </div>
      </div>
    </app-shell>
  `
})
export class InternshipFeedComponent implements OnInit {
  navItems = [
    { label: 'Browse Internships', icon: 'explore', route: '/student/feed' },
    { label: 'My Applications', icon: 'assignment', route: '/student/dashboard' },
    { label: 'My Profile', icon: 'person', route: '/student/profile' },
  ];

  internships: any[] = [];
  totalCount = 0;
  loading = false;
  filters = { search: '', location: '', role: '', duration: '' };

  applyModal = false;
  selectedInternship: any = null;
  resumeFile: File | null = null;
  coverLetter = '';
  applying = false;
  applyError = '';
  applySuccess = '';

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() { this.loadInternships(); }

  loadInternships() {
    this.loading = true;
    this.api.getInternships(this.filters).subscribe({
      next: (data) => { this.internships = data; this.totalCount = data.length; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  clearFilters() {
    this.filters = { search: '', location: '', role: '', duration: '' };
    this.loadInternships();
  }

  openApply(internship: any) {
    this.selectedInternship = internship;
    this.applyError = '';
    this.applySuccess = '';
    this.resumeFile = null;
    this.coverLetter = '';
    this.applyModal = true;
  }

  closeModal() {
    if (!this.applying) { this.applyModal = false; this.selectedInternship = null; }
  }

  onFileChange(event: any) {
    this.resumeFile = event.target.files[0] || null;
  }

  submitApplication() {
    if (!this.resumeFile) return;
    this.applying = true;
    this.applyError = '';
    this.applySuccess = '';

    const fd = new FormData();
    fd.append('internshipId', this.selectedInternship._id);
    fd.append('resume', this.resumeFile);
    fd.append('coverLetter', this.coverLetter);

    this.api.applyToInternship(fd).subscribe({
      next: () => {
        this.applySuccess = '🎉 Application submitted successfully!';
        this.applying = false;
        setTimeout(() => this.closeModal(), 2000);
      },
      error: (err) => {
        this.applyError = err.error?.message || 'Application failed.';
        this.applying = false;
      }
    });
  }
}
