import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreditRequestService } from '../../core/services/credit-request.service';
import { CreditRequest, RequestStatus } from '../../core/models/credit-request.model';

@Component({
  selector: 'app-credit-request-list',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './credit-request-list.component.html',
  styleUrls: ['./credit-request-list.component.scss']
})
export class CreditRequestListComponent implements OnInit {

  requests: CreditRequest[] = [];
  loading = false;
  selectedStatus: RequestStatus | '' = '';
  page = 0;
  totalPages = 0;

  readonly statusOptions: { value: RequestStatus | ''; label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'APPROVED', label: 'Aprobado' },
    { value: 'REJECTED', label: 'Rechazado' }
  ];

  constructor(
    private service: CreditRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const status = this.selectedStatus || undefined;
    this.service.findAll(this.page, 10, status).subscribe({
      next: (data) => {
        this.requests = data.content;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onFilterChange(): void {
    this.page = 0;
    this.load();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/requests', id]);
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.load();
    }
  }

  statusColor(status: RequestStatus): string {
    const map: Record<RequestStatus, string> = {
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'danger'
    };
    return map[status];
  }

  statusLabel(status: RequestStatus): string {
    const map: Record<RequestStatus, string> = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobado',
      REJECTED: 'Rechazado'
    };
    return map[status];
  }
}
