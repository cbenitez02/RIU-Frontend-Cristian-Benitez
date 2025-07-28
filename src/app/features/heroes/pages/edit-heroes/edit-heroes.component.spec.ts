import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Hero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { EditHeroesComponent } from './edit-heroes.component';

describe('EditHeroesComponent', () => {
  let component: EditHeroesComponent;
  let fixture: ComponentFixture<EditHeroesComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: {
    snapshot: {
      paramMap: {
        get: jasmine.Spy;
      };
    };
  };
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  const mockHero: Hero = {
    id: 1,
    name: 'SUPERMAN',
    power: 'Superfuerza',
    description: 'El último hijo de Krypton con poderes extraordinarios',
  };

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', ['getById', 'updateAsync', 'update']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [EditHeroesComponent],
      providers: [
        provideAnimations(),
        { provide: HeroService, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LoadingService, useValue: mockLoadingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditHeroesComponent);
    component = fixture.componentInstance;
  });

  describe('Component initialization', () => {
    it('should create the component correctly', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with loading state as true', () => {
      expect(component.isLoading()).toBe(true);
    });

    it('should initialize with heroToEdit as null', () => {
      expect(component.heroToEdit()).toBeNull();
    });
  });

  describe('ngOnInit - Hero loading', () => {
    it('should load hero when valid ID exists in route', () => {
      mockHeroService.getById.and.returnValue(mockHero);

      component.ngOnInit();

      expect(mockHeroService.getById).toHaveBeenCalledWith(1);
      expect(component.heroToEdit()).toEqual(mockHero);
      expect(component.isLoading()).toBe(false);
    });

    it('should navigate to /heroes when hero does not exist', () => {
      mockHeroService.getById.and.returnValue(undefined);

      component.ngOnInit();

      expect(mockHeroService.getById).toHaveBeenCalledWith(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
      expect(component.heroToEdit()).toBeNull();
    });

    it('should handle correctly when there is no ID in route', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

      component.ngOnInit();

      expect(component.isLoading()).toBe(false);
      expect(component.heroToEdit()).toBeNull();
    });

    it('should handle non-numeric ID', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('abc');

      component.ngOnInit();

      expect(mockHeroService.getById).not.toHaveBeenCalled();
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('onSaveHero - Hero saving', () => {
    beforeEach(() => {
      mockHeroService.getById.and.returnValue(mockHero);
      component.ngOnInit();
    });

    it('should update existing hero successfully', () => {
      const heroToUpdate: Hero = {
        id: 1,
        name: 'SUPERMAN UPDATED',
        power: 'Enhanced super strength',
        description: 'Updated description',
      };

      mockHeroService.updateAsync.and.returnValue(of(heroToUpdate));

      component.onSaveHero(heroToUpdate);

      expect(mockHeroService.updateAsync).toHaveBeenCalledWith(heroToUpdate);
      expect(mockHeroService.update).toHaveBeenCalledWith(heroToUpdate);
      expect(mockLoadingService.hide).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
    });

    it('should handle errors when updating hero', () => {
      const heroToUpdate: Hero = { ...mockHero };
      const errorMessage = 'Server error';

      spyOn(console, 'error');
      mockHeroService.updateAsync.and.returnValue(throwError(() => new Error(errorMessage)));

      component.onSaveHero(heroToUpdate);

      expect(mockHeroService.updateAsync).toHaveBeenCalledWith(heroToUpdate);
      expect(mockLoadingService.hide).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error updating hero:', jasmine.any(Error));
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should show error when trying to save hero without ID', () => {
      const heroWithoutId: Omit<Hero, 'id'> = {
        name: 'NEW HERO',
        power: 'New power',
        description: 'New description',
      };

      spyOn(console, 'error');

      component.onSaveHero(heroWithoutId);

      expect(console.error).toHaveBeenCalledWith(
        'Error: Se intentó guardar un héroe sin ID en modo edición',
      );
      expect(mockHeroService.updateAsync).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('onCancel - Cancellation', () => {
    it('should navigate to heroes list when canceling', () => {
      component.onCancel();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
    });
  });

  describe('Template integration', () => {
    beforeEach(() => {
      mockHeroService.getById.and.returnValue(mockHero);
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render heroes form when hero is loaded', () => {
      const heroesFormElement = fixture.debugElement.nativeElement.querySelector('app-heroes-form');
      expect(heroesFormElement).toBeTruthy();
    });

    it('should pass hero to child component', () => {
      fixture.detectChanges();
      const heroesFormComponent =
        fixture.debugElement.nativeElement.querySelector('app-heroes-form');
      expect(heroesFormComponent).toBeTruthy();
    });
  });

  describe('Component states', () => {
    it('should maintain loading state correctly', () => {
      expect(component.isLoading()).toBe(true);

      mockHeroService.getById.and.returnValue(mockHero);
      component.ngOnInit();

      expect(component.isLoading()).toBe(false);
    });

    it('should maintain hero to edit state', () => {
      expect(component.heroToEdit()).toBeNull();

      mockHeroService.getById.and.returnValue(mockHero);
      component.ngOnInit();

      expect(component.heroToEdit()).toEqual(mockHero);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero ID correctly', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('0');

      component.ngOnInit();

      expect(mockHeroService.getById).not.toHaveBeenCalled();
      expect(component.isLoading()).toBe(false);
    });

    it('should handle negative ID', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('-1');
      mockHeroService.getById.and.returnValue(undefined);

      component.ngOnInit();

      expect(mockHeroService.getById).toHaveBeenCalledWith(-1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes']);
    });

    it('should handle multiple calls to onSaveHero', () => {
      const heroToUpdate: Hero = { ...mockHero };
      mockHeroService.updateAsync.and.returnValue(of(heroToUpdate));

      component.onSaveHero(heroToUpdate);
      component.onSaveHero(heroToUpdate);

      expect(mockHeroService.updateAsync).toHaveBeenCalledTimes(2);
    });
  });
});
