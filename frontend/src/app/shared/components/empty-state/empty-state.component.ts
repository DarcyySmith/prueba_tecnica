import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IonIcon],
  template: `
    <div class="empty-state">
      <ion-icon [name]="icon" class="empty-icon"></ion-icon>
      <p class="empty-text">{{ message }}</p>
    </div>
  `,
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() icon = 'document-outline';
  @Input({ required: true }) message!: string;

  constructor() {
    addIcons({ documentOutline });
  }
}
