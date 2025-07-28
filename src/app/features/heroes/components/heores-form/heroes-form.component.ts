import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Hero } from '../../../../core/models/hero.model';
import { UppercaseDirective } from '../../../../shared/directives/uppercase.directive';

@Component({
  selector: 'app-heroes-form',
  templateUrl: './heroes-form.component.html',
  styleUrls: ['./heroes-form.component.css'],
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, UppercaseDirective],
})
export class HeroesFormComponent {
  hero = input<Hero | null>(null);
  saveHero = output<Omit<Hero, 'id'> | Hero>();
  cancelForm = output<void>();

  readonly name = signal('');
  readonly power = signal('');
  readonly description = signal('');

  readonly formTitle = computed(() => {
    return this.hero() ? 'Editar Héroe' : 'Agregar Héroe';
  });

  readonly submitButtonText = computed(() => {
    return this.hero() ? 'Actualizar' : 'Guardar';
  });

  constructor() {
    effect(() => {
      const heroValue = this.hero();
      if (heroValue) {
        this.name.set(heroValue.name.toUpperCase());
        this.power.set(heroValue.power);
        this.description.set(heroValue.description);
      } else {
        this.resetForm();
      }
    });
  }

  readonly isValid = computed(() => {
    return (
      this.name().trim().length > 0 &&
      this.power().trim().length > 0 &&
      this.description().trim().length > 0
    );
  });

  readonly nameError = computed(() =>
    this.name().trim().length === 0 ? 'El nombre es requerido' : null,
  );

  readonly powerError = computed(() =>
    this.power().trim().length === 0 ? 'El poder es requerido' : null,
  );

  readonly descriptionError = computed(() =>
    this.description().trim().length === 0 ? 'La descripción es requerida' : null,
  );

  onNameChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.name.set(value.toUpperCase());
  }

  onPowerChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.power.set(value);
  }

  onDescriptionChange(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.description.set(value);
  }

  onSubmit(): void {
    if (!this.isValid()) {
      return;
    }

    const heroData = {
      name: this.name(),
      power: this.power(),
      description: this.description(),
    };

    const heroValue = this.hero();
    if (heroValue) {
      this.saveHero.emit({ ...heroData, id: heroValue.id });
    } else {
      this.saveHero.emit(heroData);
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancelForm.emit();
  }

  private resetForm(): void {
    this.name.set('');
    this.power.set('');
    this.description.set('');
  }
}
