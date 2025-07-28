import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Hero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { HeroesFinderComponent } from '../../components/heroes-finder/heroes-finder.component';
import { HeroesTableComponent } from '../../components/heroes-table/heroes-table.component';

@Component({
  selector: 'app-heroes-page',
  templateUrl: './heroes-page.component.html',
  styleUrls: ['./heroes-page.component.css'],
  imports: [HeroesTableComponent, HeroesFinderComponent],
})
export class HeroesPageComponent {
  private readonly heroService = inject(HeroService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);

  readonly heroes = computed(() => this.heroService.heroes());
  readonly isLoading = signal(false);
  private readonly searchTerm = signal('');

  readonly filteredHeroes = computed(() => {
    const term = this.searchTerm().toLowerCase().replace(/\s+/g, '').trim();
    if (!term) return this.heroes();
    return this.heroes().filter(hero => hero.name.toLowerCase().replace(/\s+/g, '').includes(term));
  });

  onSearchTermChange(term: string): void {
    this.searchTerm.set(term);
  }

  onAddHero(): void {
    this.router.navigate(['/heroes/add']);
  }

  onEditHero(hero: Hero): void {
    this.router.navigate(['/heroes/edit', hero.id]);
  }

  onDeleteHero(heroId: number): void {
    this.heroService
      .deleteAsync()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: () => {
          this.heroService.delete(heroId);
        },
        error: error => {
          console.error('Error deleting hero:', error);
        },
      });
  }
}
