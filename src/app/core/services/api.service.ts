import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly BASE = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // ─── Internships ───
  getInternships(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => { if (v) params = params.set(k, String(v)); });
    }
    return this.http.get(`${this.BASE}/internships`, { params });
  }

  getInternshipById(id: string): Observable<any> {
    return this.http.get(`${this.BASE}/internships/${id}`);
  }

  getMyInternships(): Observable<any> {
    return this.http.get(`${this.BASE}/internships/company/mine`);
  }

  createInternship(data: any): Observable<any> {
    return this.http.post(`${this.BASE}/internships`, data);
  }

  updateInternship(id: string, data: any): Observable<any> {
    return this.http.put(`${this.BASE}/internships/${id}`, data);
  }

  deleteInternship(id: string): Observable<any> {
    return this.http.delete(`${this.BASE}/internships/${id}`);
  }

  // ─── Applications ───
  applyToInternship(formData: FormData): Observable<any> {
    return this.http.post(`${this.BASE}/applications`, formData);
  }

  getMyApplications(): Observable<any> {
    return this.http.get(`${this.BASE}/applications/my`);
  }

  getApplicantsForInternship(internshipId: string): Observable<any> {
    return this.http.get(`${this.BASE}/applications/internship/${internshipId}`);
  }

  updateApplicationStatus(appId: string, status: string): Observable<any> {
    return this.http.put(`${this.BASE}/applications/${appId}/status`, { status });
  }

  // ─── Student Profile ───
  getStudentProfile(): Observable<any> {
    return this.http.get(`${this.BASE}/student/profile`);
  }

  updateStudentProfile(data: any): Observable<any> {
    return this.http.put(`${this.BASE}/student/profile`, data);
  }

  // ─── Company Profile ───
  getCompanyProfile(): Observable<any> {
    return this.http.get(`${this.BASE}/company/profile`);
  }

  updateCompanyProfile(data: any): Observable<any> {
    return this.http.put(`${this.BASE}/company/profile`, data);
  }

  // ─── Admin ───
  getAdminStats(): Observable<any> {
    return this.http.get(`${this.BASE}/admin/stats`);
  }

  getAllStudents(search?: string): Observable<any> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get(`${this.BASE}/admin/students`, { params });
  }

  getAllCompanies(search?: string): Observable<any> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get(`${this.BASE}/admin/companies`, { params });
  }

  toggleCompanyVerification(id: string): Observable<any> {
    return this.http.put(`${this.BASE}/admin/companies/${id}/verify`, {});
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.BASE}/admin/users/${id}`);
  }

  deleteCompany(id: string): Observable<any> {
    return this.http.delete(`${this.BASE}/admin/companies/${id}`);
  }
}
