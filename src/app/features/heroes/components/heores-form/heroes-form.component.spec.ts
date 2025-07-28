import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { Hero } from '../../../../core/models/hero.model';
import { HeroesFormComponent } from './heroes-form.component';

describe('HeroesFormComponent', () => {
  let component: HeroesFormComponent;
  let fixture: ComponentFixture<HeroesFormComponent>;

  const mockHero: Hero = {
    id: 1,
    name: 'TEST HERO',
    power: 'Super strength',
    description: 'A very strong hero',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesFormComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesFormComponent);
    component = fixture.componentInstance;
  });

  describe('Component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty form fields', () => {
      expect(component.name()).toBe('');
      expect(component.power()).toBe('');
      expect(component.description()).toBe('');
    });

    it('should have null hero input by default', () => {
      expect(component.hero).toBeNull();
    });

    it('should initialize computed properties correctly for new hero', () => {
      expect(component.formTitle()).toBe('Agregar Héroe');
      expect(component.submitButtonText()).toBe('Guardar');
      expect(component.isValid()).toBe(false);
    });
  });

  describe('Computed properties', () => {
    it('should show "Editar Héroe" title when hero is provided', () => {
      component.hero = mockHero;
      expect(component.formTitle()).toBe('Editar Héroe');
    });

    it('should show "Actualizar" button text when hero is provided', () => {
      component.hero = mockHero;
      expect(component.submitButtonText()).toBe('Actualizar');
    });

    it('should validate form correctly with all fields filled', () => {
      component.name.set('TEST HERO');
      component.power.set('Super strength');
      component.description.set('A very strong hero');

      expect(component.isValid()).toBe(true);
    });

    it('should invalidate form when name is empty', () => {
      component.name.set('');
      component.power.set('Super strength');
      component.description.set('A very strong hero');

      expect(component.isValid()).toBe(false);
    });

    it('should invalidate form when power is empty', () => {
      component.name.set('TEST HERO');
      component.power.set('');
      component.description.set('A very strong hero');

      expect(component.isValid()).toBe(false);
    });

    it('should invalidate form when description is empty', () => {
      component.name.set('TEST HERO');
      component.power.set('Super strength');
      component.description.set('');

      expect(component.isValid()).toBe(false);
    });
  });

  describe('Error messages', () => {
    it('should show name error when name is empty', () => {
      component.name.set('');
      expect(component.nameError()).toBe('El nombre es requerido');
    });

    it('should show power error when power is empty', () => {
      component.power.set('');
      expect(component.powerError()).toBe('El poder es requerido');
    });

    it('should show description error when description is empty', () => {
      component.description.set('');
      expect(component.descriptionError()).toBe('La descripción es requerida');
    });

    it('should not show errors when fields have content', () => {
      component.name.set('TEST HERO');
      component.power.set('Super strength');
      component.description.set('A very strong hero');

      expect(component.nameError()).toBeNull();
      expect(component.powerError()).toBeNull();
      expect(component.descriptionError()).toBeNull();
    });
  });

  describe('ngOnChanges', () => {
    it('should populate form fields when hero is provided', () => {
      const changes = {
        hero: new SimpleChange(null, mockHero, true),
      };

      component.hero = mockHero;
      component.ngOnChanges(changes);

      expect(component.name()).toBe('TEST HERO');
      expect(component.power()).toBe('Super strength');
      expect(component.description()).toBe('A very strong hero');
    });

    it('should reset form when hero is removed', () => {
      component.hero = mockHero;
      component.ngOnChanges({
        hero: new SimpleChange(null, mockHero, false),
      });

      component.hero = null;
      component.ngOnChanges({
        hero: new SimpleChange(mockHero, null, false),
      });

      expect(component.name()).toBe('');
      expect(component.power()).toBe('');
      expect(component.description()).toBe('');
    });

    it('should convert hero name to uppercase when loading', () => {
      const lowerCaseHero: Hero = {
        ...mockHero,
        name: 'test hero',
      };

      component.hero = lowerCaseHero;
      component.ngOnChanges({
        hero: new SimpleChange(null, lowerCaseHero, true),
      });

      expect(component.name()).toBe('TEST HERO');
    });
  });

  describe('Input change handlers', () => {
    it('should update name and convert to uppercase', () => {
      const event = {
        target: { value: 'test hero' },
      } as unknown as Event;

      component.onNameChange(event);

      expect(component.name()).toBe('TEST HERO');
    });

    it('should update power field', () => {
      const event = {
        target: { value: 'Super speed' },
      } as unknown as Event;

      component.onPowerChange(event);

      expect(component.power()).toBe('Super speed');
    });

    it('should update description field', () => {
      const event = {
        target: { value: 'A very fast hero' },
      } as unknown as Event;

      component.onDescriptionChange(event);

      expect(component.description()).toBe('A very fast hero');
    });
  });

  describe('Form submission', () => {
    beforeEach(() => {
      component.name.set('TEST HERO');
      component.power.set('Super strength');
      component.description.set('A very strong hero');
    });

    it('should emit saveHero with hero data when editing existing hero', () => {
      spyOn(component.saveHero, 'emit');
      component.hero = mockHero;

      component.onSubmit();

      expect(component.saveHero.emit).toHaveBeenCalledWith({
        id: 1,
        name: 'TEST HERO',
        power: 'Super strength',
        description: 'A very strong hero',
      });
    });

    it('should emit saveHero without id when creating new hero', () => {
      spyOn(component.saveHero, 'emit');
      component.hero = null;

      component.onSubmit();

      expect(component.saveHero.emit).toHaveBeenCalledWith({
        name: 'TEST HERO',
        power: 'Super strength',
        description: 'A very strong hero',
      });
    });

    it('should not emit when form is invalid', () => {
      spyOn(component.saveHero, 'emit');
      component.name.set('');

      component.onSubmit();

      expect(component.saveHero.emit).not.toHaveBeenCalled();
    });
  });

  describe('Form cancellation', () => {
    it('should reset form and emit cancelForm', () => {
      spyOn(component.cancelForm, 'emit');
      component.name.set('TEST HERO');
      component.power.set('Super strength');
      component.description.set('A very strong hero');

      component.onCancel();

      expect(component.name()).toBe('');
      expect(component.power()).toBe('');
      expect(component.description()).toBe('');
      expect(component.cancelForm.emit).toHaveBeenCalled();
    });
  });

  describe('Template integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render form title correctly for new hero', () => {
      const titleElement = fixture.debugElement.nativeElement.querySelector('h2');
      expect(titleElement.textContent).toContain('Agregar Héroe');
    });

    it('should render submit button text correctly for new hero', () => {
      const submitButton =
        fixture.debugElement.nativeElement.querySelector('button[color="primary"]');
      expect(submitButton.textContent.trim()).toBe('Guardar');
    });

    it('should disable submit button when form is invalid', () => {
      const submitButton =
        fixture.debugElement.nativeElement.querySelector('button[color="primary"]');
      expect(submitButton.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.name.set('TEST HERO');
      component.power.set('Super strength');
      component.description.set('A very strong hero');
      fixture.detectChanges();

      const submitButton =
        fixture.debugElement.nativeElement.querySelector('button[color="primary"]');
      expect(submitButton.disabled).toBe(false);
    });

    it('should show form fields correctly', () => {
      const formFields = fixture.debugElement.nativeElement.querySelectorAll('mat-form-field');
      expect(formFields.length).toBe(3);

      const nameField = fixture.debugElement.nativeElement.querySelector(
        'input[placeholder="Nombre del héroe"]',
      );
      const powerField = fixture.debugElement.nativeElement.querySelector(
        'input[placeholder="Poder principal"]',
      );
      const descriptionField = fixture.debugElement.nativeElement.querySelector(
        'textarea[placeholder="Descripción del héroe"]',
      );

      expect(nameField).toBeTruthy();
      expect(powerField).toBeTruthy();
      expect(descriptionField).toBeTruthy();
    });
  });

  describe('Signal reactivity', () => {
    it('should update computed properties when signals change', () => {
      expect(component.isValid()).toBe(false);

      component.name.set('TEST HERO');
      expect(component.isValid()).toBe(false);

      component.power.set('Super strength');
      expect(component.isValid()).toBe(false);

      component.description.set('A very strong hero');
      expect(component.isValid()).toBe(true);
    });

    it('should update error messages when signals change', () => {
      expect(component.nameError()).toBe('El nombre es requerido');

      component.name.set('TEST HERO');
      expect(component.nameError()).toBeNull();

      component.name.set('');
      expect(component.nameError()).toBe('El nombre es requerido');
    });
  });

  describe('Edge cases', () => {
    it('should handle whitespace-only input correctly', () => {
      component.name.set('   ');
      component.power.set('   ');
      component.description.set('   ');

      expect(component.isValid()).toBe(false);
      expect(component.nameError()).toBe('El nombre es requerido');
      expect(component.powerError()).toBe('El poder es requerido');
      expect(component.descriptionError()).toBe('La descripción es requerida');
    });

    it('should handle very long input values', () => {
      const longText = 'A'.repeat(1000);
      component.name.set(longText);
      component.power.set(longText);
      component.description.set(longText);

      expect(component.isValid()).toBe(true);
      expect(component.name()).toBe(longText);
      expect(component.power()).toBe(longText);
      expect(component.description()).toBe(longText);
    });

    it('should handle special characters in input', () => {
      component.name.set('HERO-WITH-SPECIAL!@#');
      component.power.set('Power with émojis 🚀');
      component.description.set('Description with symbols & characters');

      expect(component.isValid()).toBe(true);
    });
  });
});
