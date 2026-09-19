
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
    path: 'SharedTickets',
    loadComponent: () =>
      import('./Features/Shared Tickets/shared-tickets/shared-tickets').then(m => m.SharedTickets)
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
        path: 'registerUsers',
        loadComponent: () =>
          import('./Features/SuperAdmin/Register Users/register-users/register-users')
            .then(m => m.RegisterUsers)
      },
      {
        path: 'Countries',
        loadComponent: () =>
          import('./Features/SuperAdmin/Countries/countries/countries')
            .then(m => m.Countries)
      },
      {
        path: 'Provinces',
        loadComponent: () =>
          import('./Features/SuperAdmin/Provinces/provinces/provinces')
            .then(m => m.Provinces)
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
      },
      {
        path: 'Airlines',
        loadComponent: () =>
          import('./Features/SuperAdmin/Airlines/airlines/airlines')
            .then(m => m.Airlines)
      },
      {
        path: 'Airports',
        loadComponent: () =>
          import('./Features/SuperAdmin/Airports/airports/airports')
            .then(m => m.Airports)
      },
      {
        path: 'Services',
        loadComponent: () =>
          import('./Features/SuperAdmin/Services/services/services')
            .then(m => m.Services)
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
      },
      {
        path: 'BranchService',
        loadComponent: () =>
          import('./Features/Admin/Services/branch-services/branch-services')
            .then(m => m.BranchServices)
      },
      {
        path: 'Inventory',
        loadComponent: () =>
          import('./Features/Admin/Inventory Management/Purchase Tickets/purchase-ticket/purchase-ticket')
            .then(m => m.PurchaseTicket)
      },
      {
        path: 'AvailableTickets',
        loadComponent: () =>
          import('./Features/Admin/Inventory Management/Purchase Tickets/Available Tickets/available-tickets/available-tickets')
            .then(m => m.AvailableTickets)
      }
    ]
  }
];
