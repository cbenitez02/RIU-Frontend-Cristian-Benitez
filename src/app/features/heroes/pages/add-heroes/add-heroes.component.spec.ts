import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { Hero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero.service';
import { AddHeroesComponent } from './add-heroes.component';

describe('AddHeroesComponent', () => {
  let component: AddHeroesComponent;
  let fixture: ComponentFixture<AddHeroesComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['create']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddHeroesComponent],
      providers: [
        provideAnimations(),
        { provide: HeroService, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddHeroesComponent);
    component = fixture.componentInstance;
  });

  describe('Component initialization', () => {
    it('should create the component correctly', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('onSaveHero - Hero creation', () => {
    it('should create new hero and navigate to heroes list', () => {
      const newHeroData: Omit<Hero, 'id'> = {
        name: 'NEW HERO',
        power: 'New power',
        description: 'New hero description',
      };

      component.onSaveHero(newHeroData);

      expect(mockHeroService.create).toHaveBeenCalledWith(newHeroData);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
    });

    it('should handle hero creation with minimal data', () => {
      const minimalHeroData: Omit<Hero, 'id'> = {
        name: 'MINIMAL HERO',
        power: '',
        description: '',
      };

      component.onSaveHero(minimalHeroData);

      expect(mockHeroService.create).toHaveBeenCalledWith(minimalHeroData);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
    });

    it('should handle hero creation with special characters', () => {
      const specialHeroData: Omit<Hero, 'id'> = {
        name: 'HERO-WITH-SPECIAL-CHARS!@#',
        power: 'Power with émojis 🚀',
        description: 'Description with "quotes" and symbols',
      };

      component.onSaveHero(specialHeroData);

      expect(mockHeroService.create).toHaveBeenCalledWith(specialHeroData);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
    });
  });

  describe('onCancel - Cancellation', () => {
    it('should navigate to heroes list when canceling', () => {
      component.onCancel();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
      expect(mockHeroService.create).not.toHaveBeenCalled();
    });
  });

  describe('Template integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render heroes form component', () => {
      const heroesFormElement = fixture.debugElement.nativeElement.querySelector('app-heroes-form');
      expect(heroesFormElement).toBeTruthy();
    });
  });

  describe('User interactions', () => {
    it('should handle multiple save operations', () => {
      const heroData1: Omit<Hero, 'id'> = {
        name: 'HERO ONE',
        power: 'Power one',
        description: 'First hero',
      };

      const heroData2: Omit<Hero, 'id'> = {
        name: 'HERO TWO',
        power: 'Power two',
        description: 'Second hero',
      };

      component.onSaveHero(heroData1);
      component.onSaveHero(heroData2);

      expect(mockHeroService.create).toHaveBeenCalledTimes(2);
      expect(mockHeroService.create).toHaveBeenCalledWith(heroData1);
      expect(mockHeroService.create).toHaveBeenCalledWith(heroData2);
      expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
    });

    it('should handle alternating save and cancel operations', () => {
      const heroData: Omit<Hero, 'id'> = {
        name: 'TEST HERO',
        power: 'Test power',
        description: 'Test description',
      };

      component.onSaveHero(heroData);
      component.onCancel();

      expect(mockHeroService.create).toHaveBeenCalledOnceWith(heroData);
      expect(mockRouter.navigate).toHaveBeenCalledTimes(2);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
    });
  });
});
