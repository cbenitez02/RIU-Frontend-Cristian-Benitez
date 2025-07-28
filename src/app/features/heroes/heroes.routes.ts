import { Routes } from '@angular/router';

export const HEROES_ROUTES: Routes = [
  {
    path: 'add',
    loadComponent: () =>
      import('./pages/add-heroes/add-heroes.component').then(m => m.AddHeroesComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/edit-heroes/edit-heroes.component').then(m => m.EditHeroesComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/heroes/heroes-page.component').then(m => m.HeroesPageComponent),
  },
];
