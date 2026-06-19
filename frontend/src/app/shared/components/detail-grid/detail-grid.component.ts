import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DetailItem {
  label: string;
  value: string;
  wide?: boolean;
  light?: boolean;
}

@Component({
  selector: 'app-detail-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="detail-grid">
      <div
        *ngFor="let item of items"
        class="detail-item"
        [class.detail-grid-wide]="item.wide"
        [class.light]="item.light">
        <p class="detail-label">{{ item.label }}</p>
        <p class="detail-value">{{ item.value }}</p>
      </div>
    </div>
  `,
  styleUrl: './detail-grid.component.scss'
})
export class DetailGridComponent {
  @Input({ required: true }) items: DetailItem[] = [];
}
