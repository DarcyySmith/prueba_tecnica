import { Component } from '@angular/core';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [IonSpinner],
  template: `
    <div class="loading-spinner">
      <ion-spinner name="crescent"></ion-spinner>
    </div>
  `,
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {}
