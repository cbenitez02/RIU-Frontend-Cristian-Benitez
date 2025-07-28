import {
  afterNextRender,
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  private readonly el = inject(ElementRef);
  private readonly inputValue = signal('');
  private readonly cursorPosition = signal(0);
  private readonly initialized = signal(false);

  constructor() {
    afterNextRender(() => {
      const input = this.el.nativeElement as HTMLInputElement;
      if (input.value && !this.initialized()) {
        this.inputValue.set(input.value.toUpperCase());
        this.initialized.set(true);
      }
    });

    effect(() => {
      const input = this.el.nativeElement as HTMLInputElement;
      const value = this.inputValue();
      const position = this.cursorPosition();

      if (input.value !== value && this.initialized()) {
        input.value = value;
        input.setSelectionRange(position, position);

        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const currentPosition = input.selectionStart || 0;

    this.initialized.set(true);
    this.inputValue.set(input.value.toUpperCase());
    this.cursorPosition.set(currentPosition);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text') || '';
    const input = this.el.nativeElement as HTMLInputElement;
    const currentPosition = input.selectionStart || 0;

    const currentValue = input.value;
    const newValue =
      currentValue.slice(0, currentPosition) +
      pastedText.toUpperCase() +
      currentValue.slice(input.selectionEnd || currentPosition);

    this.inputValue.set(newValue);
    this.cursorPosition.set(currentPosition + pastedText.length);
  }
}
