
import { Routes } from '@angular/router';
import { About } from './Features/about/about';
import { authGuard } from './Core/Guards/auth-guard';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./Features/home/home').then(m => m.Home)
  },

  {
    path: 'destinations',
    loadComponent: () =>
      import('./Features/destinations/destinations').then(m => m.Destinations)
  },

  {
    path: 'services',
    loadComponent: () =>
      import('./Features/services/services')
        .then(m => m.Services)
  },

  {
    path: 'about',
    component: About
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('./Features/contact/contact')
        .then(m => m.Contact)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./Features/Auth/login/login')
        .then(m => m.Login)
  },

  {
    path: 'SuperAdminDashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./Features/SuperAdmin/Dashboard/admin-dashobard/admin-dashobard')
        .then(m => m.AdminDashobard),

    children: [
      {
        path: 'branches',
        loadComponent: () =>
          import('./Features/SuperAdmin/branches/branches')
            .then(m => m.Branches)
      },
      {
        path: 'Countries',
        loadComponent: () =>
          import('./Features/SuperAdmin/Countries/countries/countries')
            .then(m => m.Countries)
      },
      {
        path: 'PostTypes',
        loadComponent: () =>
          import('./Features/SuperAdmin/PostTypes/post-type/post-type')
            .then(m => m.PostType)
      },
      {
        path: 'PostCategories',
        loadComponent: () =>
          import('./Features/SuperAdmin/Post Category/post-category/post-category')
            .then(m => m.PostCategory)
      }
    ]
    },






  // Admin routes
  {
    path: 'AdminDashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./Features/Admin/admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboard),

    children: [
      {
        path: 'Destinations',
        loadComponent: () =>
          import('./Features/Admin/Destinations/destinations/destinations')
            .then(m => m.DestinationsComponent)
      }
    ]
  }
];
