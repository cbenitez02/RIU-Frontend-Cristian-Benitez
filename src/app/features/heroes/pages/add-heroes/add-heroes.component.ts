import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero.service';
import { HeroesFormComponent } from '../../components/heores-form/heroes-form.component';

@Component({
  selector: 'app-add-heroes',
  templateUrl: './add-heroes.component.html',
  styleUrls: ['./add-heroes.component.css'],
  imports: [HeroesFormComponent],
})
export class AddHeroesComponent {
  private readonly heroService = inject(HeroService);
  private readonly router = inject(Router);

  onSaveHero(heroData: Omit<Hero, 'id'>): void {
    this.heroService.create(heroData);

    this.router.navigate(['/heroes']);
  }

  onCancel(): void {
    this.router.navigate(['/heroes']);
  }
}
