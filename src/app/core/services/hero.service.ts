import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Hero } from '../models/hero.model';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly _heroes: WritableSignal<Hero[]> = signal([]);
  private readonly loadingService = inject(LoadingService);

  readonly heroes = computed(() => this._heroes());

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleHeroes: Hero[] = [
      {
        id: 1,
        name: 'SUPERMAN',
        power: 'Superfuerza',
        description: 'El último hijo de Krypton con poderes extraordinarios',
      },
      {
        id: 2,
        name: 'BATMAN',
        power: 'Inteligencia',
        description: 'Detective millonario que lucha contra el crimen en Gotham',
      },
      {
        id: 3,
        name: 'WONDER WOMAN',
        power: 'Fuerza amazona',
        description: 'Princesa guerrera de Themyscira',
      },
      {
        id: 4,
        name: 'SPIDERMAN',
        power: 'Agilidad y sentido arácnido',
        description: 'Joven héroe con poderes de araña que protege Nueva York',
      },
      {
        id: 5,
        name: 'IRON MAN',
        power: 'Tecnología avanzada',
        description: 'Genio millonario con una armadura de alta tecnología',
      },
      {
        id: 6,
        name: 'FLASH',
        power: 'Supervelocidad',
        description: 'El hombre más rápido del mundo capaz de viajar en el tiempo',
      },
      {
        id: 7,
        name: 'LINTERNA VERDE',
        power: 'Anillo de poder',
        description: 'Protector galáctico con un anillo que materializa su voluntad',
      },
      {
        id: 8,
        name: 'AQUAMAN',
        power: 'Control de los océanos',
        description: 'Rey de Atlantis con poder sobre todos los seres marinos',
      },
      {
        id: 9,
        name: 'CAPITAN AMERICA',
        power: 'Fuerza sobrehumana',
        description: 'Super soldado con escudo de vibranium que representa la justicia',
      },
    ];

    this._heroes.set(sampleHeroes);
  }

  public getAll(): Hero[] {
    return this._heroes();
  }

  public getById(id: number): Hero | undefined {
    return this._heroes().find(h => h.id === id);
  }

  public search(term: string): Hero[] {
    const t = term.trim().toLowerCase();
    return this._heroes().filter(h => h.name.toLowerCase().includes(t));
  }

  public create(hero: Omit<Hero, 'id'>): void {
    const currentHeroes = this._heroes();
    const maxId = currentHeroes.length > 0 ? Math.max(...currentHeroes.map(h => h.id)) : 0;

    const newHero: Hero = {
      ...hero,
      name: hero.name.toUpperCase(),
      id: maxId + 1,
    };

    this._heroes.update(heroes => [...heroes, newHero]);
  }

  public update(updatedHero: Hero): void {
    const heroToUpdate = {
      ...updatedHero,
      name: updatedHero.name.toUpperCase(),
    };

    this._heroes.update(heroes => heroes.map(h => (h.id === updatedHero.id ? heroToUpdate : h)));
  }

  public updateAsync(updatedHero: Hero): Observable<Hero> {
    this.loadingService.show();

    const heroToUpdate = {
      ...updatedHero,
      name: updatedHero.name.toUpperCase(),
    };

    return of(heroToUpdate).pipe(delay(1000));
  }

  public delete(id: number): void {
    this._heroes.update(heroes => heroes.filter(h => h.id !== id));
  }

  public deleteAsync(): Observable<boolean> {
    this.loadingService.show();

    return of(true).pipe(delay(1000));
  }

  public reset(): void {
    this._heroes.set([]);
  }
}
