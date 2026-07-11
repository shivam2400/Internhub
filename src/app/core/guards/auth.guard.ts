import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn) return true;
  router.navigate(['/login']);
  return false;
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (!auth.isLoggedIn) { router.navigate(['/login']); return false; }
    if (allowedRoles.includes(auth.role!)) return true;
    auth.redirectByRole();
    return false;
  };
};

export const publicGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (!auth.isLoggedIn) return true;
  auth.redirectByRole();
  return false;
};
