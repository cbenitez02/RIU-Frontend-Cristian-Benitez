import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

import { HeroesFinderComponent } from './heroes-finder.component';

describe('HeroesFinderComponent', () => {
  let component: HeroesFinderComponent;
  let fixture: ComponentFixture<HeroesFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroesFinderComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesFinderComponent);
    component = fixture.componentInstance;
  });

  describe('Component initialization', () => {
    it('should create the component correctly', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty search term', () => {
      expect(component.searchTerm()).toBe('');
    });
  });

  describe('onSearchChange - Search functionality', () => {
    it('should update search term when input changes', () => {
      spyOn(component.searchTermChange, 'emit');
      const mockEvent = {
        target: { value: 'superman' } as HTMLInputElement,
      } as unknown as Event;

      component.onSearchChange(mockEvent);

      expect(component.searchTerm()).toBe('superman');
      expect(component.searchTermChange.emit).toHaveBeenCalledWith('superman');
    });

    it('should handle empty search term', () => {
      spyOn(component.searchTermChange, 'emit');
      const mockEvent = {
        target: { value: '' } as HTMLInputElement,
      } as unknown as Event;

      component.onSearchChange(mockEvent);

      expect(component.searchTerm()).toBe('');
      expect(component.searchTermChange.emit).toHaveBeenCalledWith('');
    });

    it('should handle search term with spaces', () => {
      spyOn(component.searchTermChange, 'emit');
      const mockEvent = {
        target: { value: ' batman ' } as HTMLInputElement,
      } as unknown as Event;

      component.onSearchChange(mockEvent);

      expect(component.searchTerm()).toBe(' batman ');
      expect(component.searchTermChange.emit).toHaveBeenCalledWith(' batman ');
    });

    it('should handle special characters in search term', () => {
      spyOn(component.searchTermChange, 'emit');
      const mockEvent = {
        target: { value: 'hero-with-special!@#' } as HTMLInputElement,
      } as unknown as Event;

      component.onSearchChange(mockEvent);

      expect(component.searchTerm()).toBe('hero-with-special!@#');
      expect(component.searchTermChange.emit).toHaveBeenCalledWith('hero-with-special!@#');
    });

    it('should handle multiple consecutive search changes', () => {
      spyOn(component.searchTermChange, 'emit');

      const mockEvent1 = {
        target: { value: 's' } as HTMLInputElement,
      } as unknown as Event;
      const mockEvent2 = {
        target: { value: 'su' } as HTMLInputElement,
      } as unknown as Event;
      const mockEvent3 = {
        target: { value: 'sup' } as HTMLInputElement,
      } as unknown as Event;

      component.onSearchChange(mockEvent1);
      component.onSearchChange(mockEvent2);
      component.onSearchChange(mockEvent3);

      expect(component.searchTerm()).toBe('sup');
      expect(component.searchTermChange.emit).toHaveBeenCalledTimes(3);
      expect(component.searchTermChange.emit).toHaveBeenCalledWith('s');
      expect(component.searchTermChange.emit).toHaveBeenCalledWith('su');
      expect(component.searchTermChange.emit).toHaveBeenCalledWith('sup');
    });
  });

  describe('onAddHero - Add hero functionality', () => {
    it('should emit addHero event when onAddHero is called', () => {
      spyOn(component.addHero, 'emit');

      component.onAddHero();

      expect(component.addHero.emit).toHaveBeenCalledWith();
    });

    it('should handle multiple calls to onAddHero', () => {
      spyOn(component.addHero, 'emit');

      component.onAddHero();
      component.onAddHero();
      component.onAddHero();

      expect(component.addHero.emit).toHaveBeenCalledTimes(3);
    });
  });

  describe('Template integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render input field', () => {
      const inputElement = fixture.debugElement.nativeElement.querySelector('input');
      expect(inputElement).toBeTruthy();
    });

    it('should render add button', () => {
      const buttonElement = fixture.debugElement.nativeElement.querySelector('button');
      expect(buttonElement).toBeTruthy();
    });

    it('should trigger onSearchChange when input value changes', () => {
      spyOn(component, 'onSearchChange');
      const inputElement = fixture.debugElement.nativeElement.querySelector('input');

      inputElement.value = 'test search';
      inputElement.dispatchEvent(new Event('input'));

      expect(component.onSearchChange).toHaveBeenCalled();
    });

    it('should trigger onAddHero when button is clicked', () => {
      spyOn(component, 'onAddHero');
      const buttonElement = fixture.debugElement.nativeElement.querySelector('button');

      buttonElement.click();

      expect(component.onAddHero).toHaveBeenCalled();
    });
  });

  describe('Signal behavior', () => {
    it('should correctly update signal value through onSearchChange', () => {
      const initialValue = component.searchTerm();
      expect(initialValue).toBe('');

      const mockEvent = {
        target: { value: 'wonder woman' } as HTMLInputElement,
      } as unknown as Event;

      component.onSearchChange(mockEvent);

      expect(component.searchTerm()).toBe('wonder woman');
      expect(component.searchTerm()).not.toBe(initialValue);
    });

    it('should maintain signal reactivity', () => {
      const values: string[] = [];

      values.push(component.searchTerm());

      const mockEvent1 = {
        target: { value: 'flash' } as HTMLInputElement,
      } as unknown as Event;
      component.onSearchChange(mockEvent1);
      values.push(component.searchTerm());

      const mockEvent2 = {
        target: { value: 'green lantern' } as HTMLInputElement,
      } as unknown as Event;
      component.onSearchChange(mockEvent2);
      values.push(component.searchTerm());

      expect(values).toEqual(['', 'flash', 'green lantern']);
    });
  });
  describe('Edge cases', () => {
    it('should handle null input target', () => {
      spyOn(component.searchTermChange, 'emit');
      const mockEvent = {
        target: null,
      } as unknown as Event;

      expect(() => component.onSearchChange(mockEvent)).toThrow();
    });

    it('should handle very long search terms', () => {
      spyOn(component.searchTermChange, 'emit');
      const longSearchTerm = 'a'.repeat(1000);
      const mockEvent = {
        target: { value: longSearchTerm } as HTMLInputElement,
      } as unknown as Event;

      component.onSearchChange(mockEvent);

      expect(component.searchTerm()).toBe(longSearchTerm);
      expect(component.searchTermChange.emit).toHaveBeenCalledWith(longSearchTerm);
    });

    it('should handle unicode characters in search term', () => {
      spyOn(component.searchTermChange, 'emit');
      const unicodeSearchTerm = '🦸‍♂️ héroe émojis 🚀';
      const mockEvent = {
        target: { value: unicodeSearchTerm } as HTMLInputElement,
      } as unknown as Event;

      component.onSearchChange(mockEvent);

      expect(component.searchTerm()).toBe(unicodeSearchTerm);
      expect(component.searchTermChange.emit).toHaveBeenCalledWith(unicodeSearchTerm);
    });
  });
});
