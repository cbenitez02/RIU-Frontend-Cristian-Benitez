import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Hero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { HeroesFormComponent } from '../../components/heores-form/heroes-form.component';

@Component({
  selector: 'app-edit-heroes',
  templateUrl: './edit-heroes.component.html',
  styleUrls: ['./edit-heroes.component.css'],
  imports: [HeroesFormComponent, MatButtonModule],
})
export class EditHeroesComponent implements OnInit {
  private readonly heroService = inject(HeroService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly loadingService = inject(LoadingService);

  readonly heroToEdit = signal<Hero | null>(null);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    const heroId = Number(this.route.snapshot.paramMap.get('id'));

    if (heroId) {
      const hero = this.heroService.getById(heroId);
      if (hero) {
        this.heroToEdit.set(hero);
      } else {
        this.router.navigate(['/heroes']);
      }
    }
    this.isLoading.set(false);
  }

  onSaveHero(heroData: Hero | Omit<Hero, 'id'>): void {
    if ('id' in heroData) {
      this.heroService
        .updateAsync(heroData)
        .pipe(finalize(() => this.loadingService.hide()))
        .subscribe({
          next: updatedHero => {
            this.heroService.update(updatedHero);
            this.router.navigate(['/heroes']);
          },
          error: error => {
            console.error('Error updating hero:', error);
          },
        });
    } else {
      console.error('Error: Se intentó guardar un héroe sin ID en modo edición');
    }
  }

  onCancel(): void {
    this.router.navigate(['/heroes']);
  }
}
