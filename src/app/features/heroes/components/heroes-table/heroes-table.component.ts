import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Hero } from '../../../../core/models/hero.model';
import {
  ConfirmDeleteHeroDialogData,
  ConfirmDeleteHeroModalComponent,
} from '../confirm-delete-hero-modal/confirm-delete-hero-modal.component';

@Component({
  selector: 'app-heroes-table',
  templateUrl: './heroes-table.component.html',
  styleUrls: ['./heroes-table.component.css'],
  imports: [CommonModule, MatTableModule, MatButtonModule, MatPaginatorModule],
})
export class HeroesTableComponent implements AfterViewInit, OnChanges {
  @Input() heroes: Hero[] = [];
  @Output() editHero = new EventEmitter<Hero>();
  @Output() deleteHero = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'name', 'power', 'description', 'actions'];
  dataSource = new MatTableDataSource<Hero>([]);

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['heroes']) {
      this.dataSource.data = this.heroes;
    }
  }

  onEdit(hero: Hero): void {
    this.editHero.emit(hero);
  }

  onDelete(hero: Hero): void {
    const dialogData: ConfirmDeleteHeroDialogData = { hero };

    const dialogRef = this.dialog.open(ConfirmDeleteHeroModalComponent, {
      width: '500px',
      data: dialogData,
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteHero.emit(hero.id);
      }
    });
  }
}
