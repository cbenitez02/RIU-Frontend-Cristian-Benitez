import { Component, EventEmitter, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-heroes-finder',
  templateUrl: './heroes-finder.component.html',
  styleUrls: ['./heroes-finder.component.css'],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class HeroesFinderComponent {
  public searchTerm = signal('');

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() addHero = new EventEmitter<void>();

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.searchTermChange.emit(value);
  }

  onAddHero() {
    this.addHero.emit();
  }
}
