import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { Hero } from '../../../../core/models/hero.model';
import { HeroesTableComponent } from './heroes-table.component';

describe('HeroesTableComponent', () => {
  let component: HeroesTableComponent;
  let fixture: ComponentFixture<HeroesTableComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const mockHeroes: Hero[] = [
    {
      id: 1,
      name: 'SUPERMAN',
      power: 'Super strength',
      description: 'The last son of Krypton with extraordinary powers',
    },
    {
      id: 2,
      name: 'BATMAN',
      power: 'Intelligence',
      description: 'Millionaire detective fighting crime in Gotham',
    },
    {
      id: 3,
      name: 'WONDER WOMAN',
      power: 'Amazon strength',
      description: 'Warrior princess of Themyscira',
    },
  ];

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HeroesTableComponent],
      providers: [provideAnimations(), { provide: MatDialog, useValue: mockDialog }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesTableComponent);
    component = fixture.componentInstance;
  });

  describe('Component initialization', () => {
    it('should create the component correctly', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty heroes array', () => {
      expect(component.heroes()).toEqual([]);
    });

    it('should initialize with correct displayed columns', () => {
      expect(component.displayedColumns).toEqual(['id', 'name', 'power', 'description', 'actions']);
    });

    it('should initialize dataSource with empty data', () => {
      expect(component.dataSource.data).toEqual([]);
    });
  });

  describe('Signal-based data updates', () => {
    it('should update dataSource when heroes input signal changes', () => {
      fixture.componentRef.setInput('heroes', mockHeroes);
      fixture.detectChanges();

      expect(component.dataSource.data).toEqual(mockHeroes);
    });

    it('should handle empty heroes array', () => {
      fixture.componentRef.setInput('heroes', mockHeroes);
      fixture.detectChanges();
      expect(component.dataSource.data).toEqual(mockHeroes);

      fixture.componentRef.setInput('heroes', []);
      fixture.detectChanges();
      expect(component.dataSource.data).toEqual([]);
    });

    it('should automatically update dataSource through effect when signal changes', () => {
      expect(component.dataSource.data).toEqual([]);

      fixture.componentRef.setInput('heroes', mockHeroes);
      fixture.detectChanges();

      expect(component.dataSource.data).toEqual(mockHeroes);
    });
  });

  describe('onEdit - Hero editing', () => {
    it('should emit editHero event with correct hero', () => {
      spyOn(component.editHero, 'emit');
      const heroToEdit = mockHeroes[0];

      component.onEdit(heroToEdit);

      expect(component.editHero.emit).toHaveBeenCalledWith(heroToEdit);
    });

    it('should handle edit for different heroes', () => {
      spyOn(component.editHero, 'emit');

      component.onEdit(mockHeroes[0]);
      component.onEdit(mockHeroes[1]);

      expect(component.editHero.emit).toHaveBeenCalledTimes(2);
      expect(component.editHero.emit).toHaveBeenCalledWith(mockHeroes[0]);
      expect(component.editHero.emit).toHaveBeenCalledWith(mockHeroes[1]);
    });
  });

  describe('onDelete - Hero deletion', () => {
    beforeEach(() => {
      spyOn(component.deleteHero, 'emit');
    });

    it('should open confirmation dialog when deleting hero', () => {
      const heroToDelete = mockHeroes[0];
      const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.afterClosed.and.returnValue(of(true));
      mockDialog.open.and.returnValue(mockDialogRef);

      component.onDelete(heroToDelete);

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should emit deleteHero event when dialog is confirmed', () => {
      const heroToDelete = mockHeroes[0];
      const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.afterClosed.and.returnValue(of(true));
      mockDialog.open.and.returnValue(mockDialogRef);

      component.onDelete(heroToDelete);

      expect(component.deleteHero.emit).toHaveBeenCalledWith(heroToDelete.id);
    });

    it('should not emit deleteHero event when dialog is canceled', () => {
      const heroToDelete = mockHeroes[0];
      const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.afterClosed.and.returnValue(of(false));
      mockDialog.open.and.returnValue(mockDialogRef);

      component.onDelete(heroToDelete);

      expect(component.deleteHero.emit).not.toHaveBeenCalled();
    });

    it('should not emit deleteHero event when dialog returns undefined', () => {
      const heroToDelete = mockHeroes[0];
      const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.afterClosed.and.returnValue(of(undefined));
      mockDialog.open.and.returnValue(mockDialogRef);

      component.onDelete(heroToDelete);

      expect(component.deleteHero.emit).not.toHaveBeenCalled();
    });
  });

  describe('Template integration', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('heroes', mockHeroes);
      fixture.detectChanges();
    });

    it('should render mat-table element', () => {
      const tableElement = fixture.debugElement.nativeElement.querySelector('mat-table');
      expect(tableElement).toBeTruthy();
    });

    it('should render correct number of rows', () => {
      fixture.detectChanges();
      const rows = fixture.debugElement.nativeElement.querySelectorAll('mat-row');
      expect(rows.length).toBe(mockHeroes.length);
    });
  });

  describe('Paginator integration', () => {
    it('should set paginator after view init', () => {
      component.ngAfterViewInit();
      expect(component.dataSource.paginator).toBe(component.paginator);
    });
  });

  describe('Edge cases', () => {
    it('should handle hero with very long description', () => {
      const longDescriptionHero: Hero = {
        id: 999,
        name: 'LONG DESCRIPTION HERO',
        power: 'Verbose power',
        description: 'A'.repeat(1000),
      };

      spyOn(component.editHero, 'emit');
      component.onEdit(longDescriptionHero);

      expect(component.editHero.emit).toHaveBeenCalledWith(longDescriptionHero);
    });

    it('should handle hero with special characters in name', () => {
      const specialCharHero: Hero = {
        id: 888,
        name: 'HERO-WITH-SPECIAL!@#$%',
        power: 'Special characters',
        description: 'Hero with special characters',
      };

      spyOn(component.editHero, 'emit');
      component.onEdit(specialCharHero);

      expect(component.editHero.emit).toHaveBeenCalledWith(specialCharHero);
    });

    it('should handle rapid successive delete operations', () => {
      spyOn(component.deleteHero, 'emit');
      const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.afterClosed.and.returnValue(of(true));
      mockDialog.open.and.returnValue(mockDialogRef);

      component.onDelete(mockHeroes[0]);
      component.onDelete(mockHeroes[1]);

      expect(mockDialog.open).toHaveBeenCalledTimes(2);
      expect(component.deleteHero.emit).toHaveBeenCalledTimes(2);
    });
  });
});
