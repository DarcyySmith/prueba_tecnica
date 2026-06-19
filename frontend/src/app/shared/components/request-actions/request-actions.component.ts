import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-actions',
  standalone: true,
  imports: [IonIcon, IonSpinner, CommonModule],
  template: `
    <div class="action-buttons">
      <button
        (click)="approve.emit()"
        [disabled]="disabled"
        class="approve-btn">
        <ion-icon name="checkmark-circle-outline"></ion-icon>
        Aprobar
      </button>
      <button
        (click)="reject.emit()"
        [disabled]="disabled"
        class="reject-btn">
        <ion-icon name="close-circle-outline"></ion-icon>
        Rechazar
      </button>
    </div>

    <div *ngIf="loading" class="updating-state">
      <ion-spinner name="dots" class="updating-spinner"></ion-spinner>
    </div>
  `,
  styleUrl: './request-actions.component.scss'
})
export class RequestActionsComponent {
  @Input() disabled = false;
  @Input() loading = false;
  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  constructor() {
    addIcons({ checkmarkCircleOutline, closeCircleOutline });
  }
}
