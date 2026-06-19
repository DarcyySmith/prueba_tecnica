import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'requests', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'requests',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/credit-request-list/credit-request-list.component').then(m => m.CreditRequestListComponent)
  },
  {
    path: 'requests/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/credit-request-form/credit-request-form.component').then(m => m.CreditRequestFormComponent)
  },
  {
    path: 'requests/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/credit-request-detail/credit-request-detail.component').then(m => m.CreditRequestDetailComponent)
  },
  { path: '**', redirectTo: 'requests' }
];
