import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Hero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { HeroesPageComponent } from './heroes-page.component';

describe('HeroesPageComponent', () => {
  let component: HeroesPageComponent;
  let fixture: ComponentFixture<HeroesPageComponent>;
  let heroService: jasmine.SpyObj<HeroService>;
  let router: jasmine.SpyObj<Router>;
  let loadingService: jasmine.SpyObj<LoadingService>;

  const mockHeroes: Hero[] = [
    {
      id: 1,
      name: 'SUPERMAN',
      power: 'Superfuerza',
      description: 'El último hijo de Krypton',
    },
    {
      id: 2,
      name: 'BATMAN',
      power: 'Inteligencia',
      description: 'Detective millonario',
    },
    {
      id: 3,
      name: 'WONDER WOMAN',
      power: 'Fuerza amazona',
      description: 'Princesa guerrera',
    },
  ];

  beforeEach(async () => {
    const heroServiceSpy = jasmine.createSpyObj('HeroService', ['deleteAsync', 'delete'], {
      heroes: jasmine.createSpy().and.returnValue(mockHeroes),
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [HeroesPageComponent],
      providers: [
        { provide: HeroService, useValue: heroServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    }).compileComponents();

    heroService = TestBed.inject(HeroService) as jasmine.SpyObj<HeroService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;

    fixture = TestBed.createComponent(HeroesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with correct properties', () => {
      expect(component.heroes()).toEqual(mockHeroes);
      expect(component.isLoading()).toBeFalse();
    });

    it('should show all heroes when no search term is applied', () => {
      expect(component.filteredHeroes()).toEqual(mockHeroes);
    });
  });

  describe('Search functionality', () => {
    it('should filter heroes based on search term', () => {
      component.onSearchTermChange('super');

      const filtered = component.filteredHeroes();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('SUPERMAN');
    });

    it('should handle case insensitive search', () => {
      component.onSearchTermChange('BATMAN');

      const filtered = component.filteredHeroes();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('BATMAN');
    });

    it('should ignore extra spaces in search term', () => {
      component.onSearchTermChange('  wonder   woman  ');

      const filtered = component.filteredHeroes();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('WONDER WOMAN');
    });

    it('should return all heroes when search term is empty', () => {
      component.onSearchTermChange('batman');
      expect(component.filteredHeroes().length).toBe(1);

      component.onSearchTermChange('');
      expect(component.filteredHeroes()).toEqual(mockHeroes);
    });

    it('should return empty array when no heroes match search term', () => {
      component.onSearchTermChange('flash');

      expect(component.filteredHeroes()).toEqual([]);
    });
  });

  describe('Navigation methods', () => {
    it('should navigate to add hero page', () => {
      component.onAddHero();

      expect(router.navigate).toHaveBeenCalledWith(['/heroes/add']);
    });

    it('should navigate to edit hero page with correct id', () => {
      const heroToEdit = mockHeroes[0];

      component.onEditHero(heroToEdit);

      expect(router.navigate).toHaveBeenCalledWith(['/heroes/edit', heroToEdit.id]);
    });
  });

  describe('Delete hero functionality', () => {
    let originalConsoleError: typeof console.error;

    beforeEach(() => {
      heroService.deleteAsync.and.returnValue(of(true));
      originalConsoleError = console.error;
      console.error = jasmine.createSpy('console.error');
    });

    afterEach(() => {
      console.error = originalConsoleError;
    });

    it('should successfully delete a hero', () => {
      const heroId = 1;

      component.onDeleteHero(heroId);

      expect(heroService.deleteAsync).toHaveBeenCalled();
      expect(heroService.delete).toHaveBeenCalledWith(heroId);
      expect(loadingService.hide).toHaveBeenCalled();
    });

    it('should hide loading state after successful deletion', () => {
      component.onDeleteHero(1);

      expect(loadingService.hide).toHaveBeenCalled();
    });

    it('should handle delete error gracefully', () => {
      const errorMessage = 'Server error';
      heroService.deleteAsync.and.returnValue(throwError(() => new Error(errorMessage)));

      component.onDeleteHero(1);

      expect(console.error).toHaveBeenCalledWith('Error deleting hero:', jasmine.any(Error));
      expect(loadingService.hide).toHaveBeenCalled();
    });

    it('should not call local delete when server delete fails', () => {
      heroService.deleteAsync.and.returnValue(throwError(() => new Error('Server error')));

      component.onDeleteHero(1);

      expect(heroService.delete).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty search string gracefully', () => {
      component.onSearchTermChange('');
      expect(component.filteredHeroes()).toEqual(mockHeroes);

      component.onSearchTermChange('   ');
      expect(component.filteredHeroes()).toEqual(mockHeroes);
    });

    it('should handle hero with missing properties during edit', () => {
      const incompleteHero = { id: 999 } as Hero;

      expect(() => component.onEditHero(incompleteHero)).not.toThrow();
      expect(router.navigate).toHaveBeenCalledWith(['/heroes/edit', 999]);
    });

    it('should handle special characters in search term', () => {
      component.onSearchTermChange('super-man');
      expect(component.filteredHeroes().length).toBe(0);

      component.onSearchTermChange('super');
      expect(component.filteredHeroes().length).toBe(1);
    });
  });
});
