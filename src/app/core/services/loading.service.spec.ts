import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should start with isLoading as false', () => {
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('show()', () => {
    it('should set isLoading to true when called once', () => {
      service.show();
      expect(service.isLoading()).toBe(true);
    });

    it('should keep isLoading true when called multiple times', () => {
      service.show();
      service.show();
      service.show();
      expect(service.isLoading()).toBe(true);
    });

    it('should increment internal loading count correctly', () => {
      service.show();
      service.show();
      service.show();

      expect(service.isLoading()).toBe(true);

      service.hide();
      expect(service.isLoading()).toBe(true);

      service.hide();
      expect(service.isLoading()).toBe(true);

      service.hide();
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('hide()', () => {
    it('should set isLoading to false when count reaches zero', () => {
      service.show();
      service.hide();
      expect(service.isLoading()).toBe(false);
    });

    it('should not go below zero count', () => {
      service.hide();
      service.hide();
      expect(service.isLoading()).toBe(false);

      service.show();
      expect(service.isLoading()).toBe(true);
      service.hide();
      expect(service.isLoading()).toBe(false);
    });

    it('should maintain true state until all show() calls are matched with hide()', () => {
      service.show();
      service.show();
      service.show();

      service.hide();
      expect(service.isLoading()).toBe(true);

      service.hide();
      expect(service.isLoading()).toBe(true);

      service.hide();
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('forceHide()', () => {
    it('should immediately set isLoading to false regardless of count', () => {
      service.show();
      service.show();
      service.show();
      expect(service.isLoading()).toBe(true);

      service.forceHide();
      expect(service.isLoading()).toBe(false);
    });

    it('should reset internal count to zero', () => {
      service.show();
      service.show();
      service.forceHide();

      service.show();
      service.hide();
      expect(service.isLoading()).toBe(false);
    });

    it('should work correctly when called without previous show() calls', () => {
      service.forceHide();
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle mixed show(), hide(), and forceHide() calls correctly', () => {
      service.show();
      service.show();
      expect(service.isLoading()).toBe(true);

      service.hide();
      expect(service.isLoading()).toBe(true);

      service.forceHide();
      expect(service.isLoading()).toBe(false);

      service.show();
      expect(service.isLoading()).toBe(true);

      service.hide();
      expect(service.isLoading()).toBe(false);
    });

    it('should maintain state consistency across multiple operations', () => {
      const operations = [
        () => service.show(),
        () => service.show(),
        () => service.hide(),
        () => service.show(),
        () => service.hide(),
        () => service.hide(),
        () => service.hide(),
      ];

      operations.forEach(op => op());

      expect(service.isLoading()).toBe(false);
    });
  });

  describe('Signal Reactivity', () => {
    it('should update signal value reactively', () => {
      expect(service.isLoading()).toBe(false);

      service.show();
      expect(service.isLoading()).toBe(true);

      service.hide();
      expect(service.isLoading()).toBe(false);

      service.show();
      service.forceHide();
      expect(service.isLoading()).toBe(false);
    });

    it('should maintain signal consistency across state changes', () => {
      const states: boolean[] = [];

      states.push(service.isLoading());

      service.show();
      states.push(service.isLoading());

      service.show();
      states.push(service.isLoading());

      service.hide();
      states.push(service.isLoading());

      service.hide();
      states.push(service.isLoading());

      expect(states).toEqual([false, true, true, true, false]);
    });
  });
});
