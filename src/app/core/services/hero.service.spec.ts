import { TestBed } from '@angular/core/testing';
import { Hero } from '../models/hero.model';
import { HeroService } from './hero.service';
import { LoadingService } from './loading.service';

describe('HeroService', () => {
  let service: HeroService;
  let loadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [HeroService, { provide: LoadingService, useValue: loadingServiceSpy }],
    });

    service = TestBed.inject(HeroService);
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with sample heroes data', () => {
      const heroes = service.getAll();
      expect(heroes.length).toBe(9);
      expect(heroes[0].name).toBe('SUPERMAN');
      expect(heroes[8].name).toBe('CAPITAN AMERICA');
    });

    it('should have heroes signal computed correctly', () => {
      const heroesSignal = service.heroes();
      const heroesArray = service.getAll();
      expect(heroesSignal).toEqual(heroesArray);
    });
  });

  describe('getAll()', () => {
    it('should return all heroes', () => {
      const heroes = service.getAll();
      expect(Array.isArray(heroes)).toBe(true);
      expect(heroes.length).toBeGreaterThan(0);
    });

    it('should return the same reference as heroes signal', () => {
      const heroesFromMethod = service.getAll();
      const heroesFromSignal = service.heroes();
      expect(heroesFromMethod).toBe(heroesFromSignal);
    });
  });

  describe('getById()', () => {
    it('should return hero when found', () => {
      const hero = service.getById(1);
      expect(hero).toBeDefined();
      expect(hero?.name).toBe('SUPERMAN');
      expect(hero?.id).toBe(1);
    });

    it('should return undefined when hero not found', () => {
      const hero = service.getById(999);
      expect(hero).toBeUndefined();
    });

    it('should return correct hero for each valid id', () => {
      const hero2 = service.getById(2);
      const hero5 = service.getById(5);

      expect(hero2?.name).toBe('BATMAN');
      expect(hero5?.name).toBe('IRON MAN');
    });
  });

  describe('search()', () => {
    it('should return heroes matching the search term', () => {
      const results = service.search('man');
      expect(results.length).toBe(6);
      results.forEach(hero => {
        expect(hero.name.toLowerCase()).toContain('man');
      });
    });

    it('should be case insensitive', () => {
      const resultsLower = service.search('super');
      const resultsUpper = service.search('SUPER');
      const resultsMixed = service.search('Super');

      expect(resultsLower).toEqual(resultsUpper);
      expect(resultsUpper).toEqual(resultsMixed);
      expect(resultsLower.length).toBe(1);
      expect(resultsLower[0].name).toBe('SUPERMAN');
    });

    it('should handle empty search term', () => {
      const results = service.search('');
      expect(results.length).toBe(9);
    });

    it('should handle whitespace-only search term', () => {
      const results = service.search('   ');
      expect(results.length).toBe(9);
    });

    it('should trim search term', () => {
      const results = service.search('  flash  ');
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('FLASH');
    });

    it('should return empty array when no matches found', () => {
      const results = service.search('nonexistent');
      expect(results).toEqual([]);
    });
  });

  describe('create()', () => {
    beforeEach(() => {
      service.reset();
    });

    it('should add a new hero with generated id', () => {
      const newHero = { name: 'new hero', power: 'New Power', description: 'New Description' };

      service.create(newHero);

      const heroes = service.getAll();
      expect(heroes.length).toBe(1);
      expect(heroes[0].name).toBe('NEW HERO');
      expect(heroes[0].id).toBe(1);
      expect(heroes[0].power).toBe('New Power');
    });

    it('should convert name to uppercase', () => {
      const newHero = { name: 'lowercase hero', power: 'Power', description: 'Description' };

      service.create(newHero);

      const createdHero = service.getAll()[0];
      expect(createdHero.name).toBe('LOWERCASE HERO');
    });

    it('should generate sequential ids', () => {
      const hero1 = { name: 'Hero 1', power: 'Power 1', description: 'Description 1' };
      const hero2 = { name: 'Hero 2', power: 'Power 2', description: 'Description 2' };

      service.create(hero1);
      service.create(hero2);

      const heroes = service.getAll();
      expect(heroes[0].id).toBe(1);
      expect(heroes[1].id).toBe(2);
    });

    it('should handle creating hero when service has existing data', () => {
      const freshService = TestBed.inject(HeroService);
      const initialCount = freshService.getAll().length;
      const existingIds = freshService.getAll().map(h => h.id);
      const maxExistingId = existingIds.length > 0 ? Math.max(...existingIds) : 0;

      const newHero = {
        name: 'Additional Hero',
        power: 'Additional Power',
        description: 'Additional Description',
      };

      freshService.create(newHero);

      const heroes = freshService.getAll();
      expect(heroes.length).toBe(initialCount + 1);
      expect(heroes[heroes.length - 1].id).toBe(maxExistingId + 1);
    });
  });

  describe('update()', () => {
    it('should update existing hero', () => {
      const updatedHero: Hero = {
        id: 1,
        name: 'updated superman',
        power: 'Updated Power',
        description: 'Updated Description',
      };

      service.update(updatedHero);

      const hero = service.getById(1);
      expect(hero?.name).toBe('UPDATED SUPERMAN');
      expect(hero?.power).toBe('Updated Power');
      expect(hero?.description).toBe('Updated Description');
    });

    it('should convert name to uppercase during update', () => {
      const updatedHero: Hero = {
        id: 2,
        name: 'lowercase batman',
        power: 'Intelligence',
        description: 'Updated Batman',
      };

      service.update(updatedHero);

      const hero = service.getById(2);
      expect(hero?.name).toBe('LOWERCASE BATMAN');
    });

    it('should not affect other heroes when updating one', () => {
      const originalSuperman = service.getById(1);
      const updatedBatman: Hero = {
        id: 2,
        name: 'new batman',
        power: 'New Intelligence',
        description: 'New Batman',
      };

      service.update(updatedBatman);

      const superman = service.getById(1);
      expect(superman).toEqual(originalSuperman);
    });

    it('should handle updating non-existent hero gracefully', () => {
      const initialHeroes = service.getAll();
      const nonExistentHero: Hero = {
        id: 9999,
        name: 'Non Existent',
        power: 'None',
        description: 'None',
      };

      service.update(nonExistentHero);

      const heroesAfterUpdate = service.getAll();
      expect(heroesAfterUpdate).toEqual(initialHeroes);
    });
  });

  describe('updateAsync()', () => {
    it('should call loading service show method', () => {
      const heroToUpdate: Hero = {
        id: 1,
        name: 'async superman',
        power: 'Async Power',
        description: 'Async Description',
      };

      service.updateAsync(heroToUpdate);

      expect(loadingService.show).toHaveBeenCalled();
    });

    it('should return observable with updated hero', done => {
      const heroToUpdate: Hero = {
        id: 1,
        name: 'async superman',
        power: 'Async Power',
        description: 'Async Description',
      };

      service.updateAsync(heroToUpdate).subscribe(result => {
        expect(result.name).toBe('ASYNC SUPERMAN');
        expect(result.power).toBe('Async Power');
        expect(result.description).toBe('Async Description');
        expect(result.id).toBe(1);
        done();
      });
    });

    it('should convert name to uppercase in async update', done => {
      const heroToUpdate: Hero = {
        id: 1,
        name: 'lowercase async',
        power: 'Power',
        description: 'Description',
      };

      service.updateAsync(heroToUpdate).subscribe(result => {
        expect(result.name).toBe('LOWERCASE ASYNC');
        done();
      });
    });
  });

  describe('delete()', () => {
    it('should remove hero with specified id', () => {
      const initialCount = service.getAll().length;

      service.delete(1);

      const heroes = service.getAll();
      expect(heroes.length).toBe(initialCount - 1);
      expect(service.getById(1)).toBeUndefined();
    });

    it('should not affect other heroes when deleting one', () => {
      const batman = service.getById(2);

      service.delete(1);

      const batmanAfterDelete = service.getById(2);
      expect(batmanAfterDelete).toEqual(batman);
    });

    it('should handle deleting non-existent hero gracefully', () => {
      const initialHeroes = service.getAll();

      service.delete(9999);

      const heroesAfterDelete = service.getAll();
      expect(heroesAfterDelete).toEqual(initialHeroes);
    });
  });

  describe('deleteAsync()', () => {
    it('should call loading service show method', () => {
      service.deleteAsync();

      expect(loadingService.show).toHaveBeenCalled();
    });

    it('should return observable with true value', done => {
      service.deleteAsync().subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });
  });

  describe('reset()', () => {
    it('should clear all heroes', () => {
      service.reset();

      const heroes = service.getAll();
      expect(heroes.length).toBe(0);
      expect(heroes).toEqual([]);
    });

    it('should update heroes signal to empty array', () => {
      service.reset();

      const heroesSignal = service.heroes();
      expect(heroesSignal.length).toBe(0);
      expect(heroesSignal).toEqual([]);
    });
  });

  describe('Signal Integration', () => {
    it('should update heroes signal when creating hero', () => {
      service.reset();
      const newHero = {
        name: 'Signal Hero',
        power: 'Signal Power',
        description: 'Signal Description',
      };

      service.create(newHero);

      const heroesSignal = service.heroes();
      expect(heroesSignal.length).toBe(1);
      expect(heroesSignal[0].name).toBe('SIGNAL HERO');
    });

    it('should update heroes signal when updating hero', () => {
      const updatedHero: Hero = {
        id: 1,
        name: 'signal updated',
        power: 'Updated',
        description: 'Updated',
      };

      service.update(updatedHero);

      const heroesSignal = service.heroes();
      const updatedHeroInSignal = heroesSignal.find(h => h.id === 1);
      expect(updatedHeroInSignal?.name).toBe('SIGNAL UPDATED');
    });

    it('should update heroes signal when deleting hero', () => {
      const initialCount = service.heroes().length;

      service.delete(1);

      const heroesSignal = service.heroes();
      expect(heroesSignal.length).toBe(initialCount - 1);
      expect(heroesSignal.find(h => h.id === 1)).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty name in create', () => {
      service.reset();
      const heroWithEmptyName = { name: '', power: 'Power', description: 'Description' };

      service.create(heroWithEmptyName);

      const heroes = service.getAll();
      expect(heroes[0].name).toBe('');
    });

    it('should handle special characters in search', () => {
      service.reset();
      service.create({ name: 'Hero-X', power: 'Power', description: 'Description' });

      const results = service.search('hero-x');
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('HERO-X');
    });

    it('should maintain data integrity across multiple operations', () => {
      service.reset();

      service.create({ name: 'Hero A', power: 'Power A', description: 'Description A' });
      service.create({ name: 'Hero B', power: 'Power B', description: 'Description B' });
      service.create({ name: 'Hero C', power: 'Power C', description: 'Description C' });

      service.update({
        id: 2,
        name: 'Updated Hero B',
        power: 'Updated Power B',
        description: 'Updated Description B',
      });

      service.delete(1);

      const finalHeroes = service.getAll();
      expect(finalHeroes.length).toBe(2);
      expect(finalHeroes.find(h => h.id === 1)).toBeUndefined();
      expect(finalHeroes.find(h => h.id === 2)?.name).toBe('UPDATED HERO B');
      expect(finalHeroes.find(h => h.id === 3)?.name).toBe('HERO C');
    });
  });
});
