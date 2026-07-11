import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="page-wrapper">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <div class="logo-text">🚀 InternHub</div>
          <div class="logo-tagline">Internship Portal</div>
        </div>

        <span class="nav-section-label">Navigation</span>
        <nav>
          <a *ngFor="let item of navItems"
            [routerLink]="item.route"
            routerLinkActive="active">
            <span class="material-icons">{{ item.icon }}</span>
            {{ item.label }}
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="avatar">{{ initial }}</div>
            <div>
              <div class="user-name">{{ user?.name }}</div>
              <div class="user-role">{{ user?.role }}</div>
            </div>
          </div>
          <button class="logout-btn" (click)="auth.logout()">
            <span class="material-icons" style="font-size:1rem">logout</span> Sign Out
          </button>
        </div>
      </aside>

      <!-- Content -->
      <main class="main-content">
        <ng-content></ng-content>
      </main>
    </div>
  `
})
export class ShellComponent {
  @Input() navItems: NavItem[] = [];

  constructor(public auth: AuthService) {}

  get user() { return this.auth.currentUser(); }
  get initial() { return this.user?.name?.charAt(0)?.toUpperCase() ?? '?'; }
}
