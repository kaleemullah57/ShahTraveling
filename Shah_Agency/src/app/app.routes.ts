import { Routes } from '@angular/router';
import { About } from './Features/about/about';

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
  }
];
