import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Hero } from '../../../../core/models/hero.model';

export interface ConfirmDeleteHeroDialogData {
  hero: Hero;
}

@Component({
  selector: 'app-confirm-delete-hero-modal',
  templateUrl: './confirm-delete-hero-modal.component.html',
  styleUrls: ['./confirm-delete-hero-modal.component.css'],
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class ConfirmDeleteHeroModalComponent {
  public dialogRef = inject(MatDialogRef<ConfirmDeleteHeroModalComponent>);
  public data = inject<ConfirmDeleteHeroDialogData>(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
