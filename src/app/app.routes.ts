import { Routes } from '@angular/router';
import { authGuard, roleGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Auth (public only)
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register/student',
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/register-student/register-student.component').then(m => m.RegisterStudentComponent)
  },
  {
    path: 'register/company',
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/register-company/register-company.component').then(m => m.RegisterCompanyComponent)
  },

  // Student routes
  {
    path: 'student/feed',
    canActivate: [roleGuard(['student'])],
    loadComponent: () => import('./features/student/internship-feed/internship-feed.component').then(m => m.InternshipFeedComponent)
  },
  {
    path: 'student/dashboard',
    canActivate: [roleGuard(['student'])],
    loadComponent: () => import('./features/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
  },
  {
    path: 'student/profile',
    canActivate: [roleGuard(['student'])],
    loadComponent: () => import('./features/student/student-profile/student-profile.component').then(m => m.StudentProfileComponent)
  },

  // Company routes
  {
    path: 'company/dashboard',
    canActivate: [roleGuard(['company'])],
    loadComponent: () => import('./features/company/company-dashboard/company-dashboard.component').then(m => m.CompanyDashboardComponent)
  },
  {
    path: 'company/profile',
    canActivate: [roleGuard(['company'])],
    loadComponent: () => import('./features/company/company-profile/company-profile.component').then(m => m.CompanyProfileComponent)
  },

  // Admin routes
  {
    path: 'admin/dashboard',
    canActivate: [roleGuard(['admin'])],
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin/verify',
    canActivate: [roleGuard(['admin'])],
    loadComponent: () => import('./features/admin/verify-companies/verify-companies.component').then(m => m.VerifyCompaniesComponent)
  },
  {
    path: 'admin/students',
    canActivate: [roleGuard(['admin'])],
    loadComponent: () => import('./features/admin/admin-students/admin-students.component').then(m => m.AdminStudentsComponent)
  },
  {
    path: 'admin/companies',
    canActivate: [roleGuard(['admin'])],
    loadComponent: () => import('./features/admin/admin-companies/admin-companies.component').then(m => m.AdminCompaniesComponent)
  },

  // Catch-all
  { path: '**', redirectTo: '/login' }
];
