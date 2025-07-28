import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

import { Hero } from '../../../../core/models/hero.model';
import {
  ConfirmDeleteHeroDialogData,
  ConfirmDeleteHeroModalComponent,
} from './confirm-delete-hero-modal.component';

describe('ConfirmDeleteHeroModalComponent', () => {
  let component: ConfirmDeleteHeroModalComponent;
  let fixture: ComponentFixture<ConfirmDeleteHeroModalComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDeleteHeroModalComponent>>;

  const mockHero: Hero = {
    id: 1,
    name: 'SUPERMAN',
    power: 'Super strength',
    description: 'The last son of Krypton with extraordinary powers',
  };

  const mockDialogData: ConfirmDeleteHeroDialogData = {
    hero: mockHero,
  };

  beforeEach(async () => {
    // Create spies for dialog
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteHeroModalComponent],
      providers: [
        provideAnimations(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteHeroModalComponent);
    component = fixture.componentInstance;
  });

  describe('Component initialization', () => {
    it('should create the component correctly', () => {
      expect(component).toBeTruthy();
    });

    it('should inject dialog data correctly', () => {
      expect(component.data).toEqual(mockDialogData);
      expect(component.data.hero).toEqual(mockHero);
    });

    it('should inject dialog reference correctly', () => {
      expect(component.dialogRef).toBeTruthy();
    });
  });

  describe('onConfirm - Confirmation action', () => {
    it('should close dialog with true when confirmed', () => {
      component.onConfirm();

      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should handle multiple confirm calls', () => {
      component.onConfirm();
      component.onConfirm();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(2);
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });
  });

  describe('onCancel - Cancellation action', () => {
    it('should close dialog with false when canceled', () => {
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('should handle multiple cancel calls', () => {
      component.onCancel();
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(2);
      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('Template integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render dialog content', () => {
      const dialogContent =
        fixture.debugElement.nativeElement.querySelector('[mat-dialog-content]');
      expect(dialogContent).toBeTruthy();
    });

    it('should render dialog actions', () => {
      const dialogActions =
        fixture.debugElement.nativeElement.querySelector('[mat-dialog-actions]');
      expect(dialogActions).toBeTruthy();
    });

    it('should render confirm button', () => {
      const confirmButton = fixture.debugElement.nativeElement.querySelector('.delete-button');
      expect(confirmButton).toBeTruthy();
    });

    it('should render cancel button', () => {
      const cancelButton = fixture.debugElement.nativeElement.querySelector('.cancel-button');
      expect(cancelButton).toBeTruthy();
    });

    it('should display hero name in dialog content', () => {
      const dialogContent =
        fixture.debugElement.nativeElement.querySelector('[mat-dialog-content]');
      expect(dialogContent.textContent).toContain(mockHero.name);
    });
  });

  describe('User interactions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call onConfirm when confirm button is clicked', () => {
      spyOn(component, 'onConfirm');
      const confirmButton = fixture.debugElement.nativeElement.querySelector('.delete-button');

      confirmButton.click();

      expect(component.onConfirm).toHaveBeenCalled();
    });

    it('should call onCancel when cancel button is clicked', () => {
      spyOn(component, 'onCancel');
      const cancelButton = fixture.debugElement.nativeElement.querySelector('.cancel-button');

      cancelButton.click();

      expect(component.onCancel).toHaveBeenCalled();
    });
  });

  describe('Different hero data scenarios', () => {
    it('should handle hero with special characters in name', () => {
      const specialHero: Hero = {
        id: 2,
        name: 'HERO-WITH-SPECIAL!@#',
        power: 'Special power',
        description: 'Special description',
      };

      component.data = { hero: specialHero };

      expect(component.data.hero.name).toBe('HERO-WITH-SPECIAL!@#');
    });

    it('should handle hero with very long name', () => {
      const longNameHero: Hero = {
        id: 3,
        name: 'A'.repeat(100),
        power: 'Long name power',
        description: 'Long name description',
      };

      component.data = { hero: longNameHero };

      expect(component.data.hero.name).toBe('A'.repeat(100));
    });

    it('should handle hero with empty description', () => {
      const emptyDescHero: Hero = {
        id: 4,
        name: 'HERO WITH EMPTY DESC',
        power: 'Some power',
        description: '',
      };

      component.data = { hero: emptyDescHero };

      expect(component.data.hero.description).toBe('');
    });
  });

  describe('Dialog behavior', () => {
    it('should handle alternating confirm and cancel operations', () => {
      component.onConfirm();
      component.onCancel();
      component.onConfirm();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(3);

      const calls = mockDialogRef.close.calls.all();
      expect(calls[0].args[0]).toBe(true);
      expect(calls[1].args[0]).toBe(false);
      expect(calls[2].args[0]).toBe(true);
    });

    it('should maintain dialog data integrity throughout component lifecycle', () => {
      const initialData = component.data;

      component.onConfirm();
      expect(component.data).toBe(initialData);

      component.onCancel();
      expect(component.data).toBe(initialData);
      expect(component.data.hero).toEqual(mockHero);
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid successive confirm clicks', () => {
      component.onConfirm();
      component.onConfirm();
      component.onConfirm();
      component.onConfirm();
      component.onConfirm();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(5);
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should handle rapid successive cancel clicks', () => {
      component.onCancel();
      component.onCancel();
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(3);
      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });
  });
});
