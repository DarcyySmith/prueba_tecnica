import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [IonIcon, CommonModule],
  template: `
    <div class="error-alert" *ngIf="message">
      <ion-icon name="alert-circle-outline" class="error-alert-icon"></ion-icon>
      {{ message }}
    </div>
  `,
  styleUrl: './error-alert.component.scss'
})
export class ErrorAlertComponent {
  @Input({ required: true }) message!: string;

  constructor() {
    addIcons({ alertCircleOutline });
  }
}
