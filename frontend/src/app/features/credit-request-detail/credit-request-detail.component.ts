import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CreditRequestService } from '../../core/services/credit-request.service';
import { CreditRequest, RequestStatus } from '../../core/models/credit-request.model';

@Component({
  selector: 'app-credit-request-detail',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './credit-request-detail.component.html',
  styleUrls: ['./credit-request-detail.component.scss']
})
export class CreditRequestDetailComponent implements OnInit {

  request: CreditRequest | null = null;
  loading = false;
  updating = false;
  errorMessage = '';
  commentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CreditRequestService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      comment: ['']
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  load(id: number): void {
    this.loading = true;
    this.service.findById(id).subscribe({
      next: (data) => { this.request = data; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/requests']); }
    });
  }

  approve(): void {
    if (!this.request) return;
    this.updateStatus('APPROVED');
  }

  reject(): void {
    if (!this.request) return;
    const comment = this.commentForm.get('comment')?.value?.trim();
    if (!comment) {
      this.errorMessage = 'El comentario es requerido para rechazar una solicitud';
      return;
    }
    this.updateStatus('REJECTED', comment);
  }

  private updateStatus(status: RequestStatus, comment?: string): void {
    if (!this.request) return;
    this.updating = true;
    this.errorMessage = '';

    this.service.updateStatus(this.request.id, { status, comment }).subscribe({
      next: (updated) => { this.request = updated; this.updating = false; },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al actualizar el estado';
        this.updating = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/requests']);
  }

  statusColor(status: RequestStatus): string {
    const map: Record<RequestStatus, string> = {
      PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger'
    };
    return map[status];
  }

  statusLabel(status: RequestStatus): string {
    const map: Record<RequestStatus, string> = {
      PENDING: 'Pendiente', APPROVED: 'Aprobado', REJECTED: 'Rechazado'
    };
    return map[status];
  }
}
