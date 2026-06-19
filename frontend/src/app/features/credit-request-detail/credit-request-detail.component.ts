import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonSpinner, IonButton, IonIcon, IonItem, IonLabel, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { CreditRequestService } from '../../core/services/credit-request.service';
import { CreditRequest, RequestStatus } from '../../core/models/credit-request.model';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';
import { DetailGridComponent, DetailItem } from '../../shared/components/detail-grid/detail-grid.component';
import { RequestActionsComponent } from '../../shared/components/request-actions/request-actions.component';

@Component({
  selector: 'app-credit-request-detail',
  standalone: true,
  imports: [IonSpinner, IonButton, IonIcon, IonItem, IonLabel, IonTextarea, CommonModule, ReactiveFormsModule, StatusBadgeComponent, LoadingSpinnerComponent, ErrorAlertComponent, DetailGridComponent, RequestActionsComponent],
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
    addIcons({ arrowBackOutline });
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

  get detailItems(): DetailItem[] {
    if (!this.request) return [];
    const r = this.request;
    const items: DetailItem[] = [
      { label: 'Monto', value: `$${r.amount.toLocaleString('en-US')}`, wide: true },
      { label: 'Plazo', value: `${r.termMonths} meses` },
      { label: 'Solicitante', value: r.applicantId },
      { label: 'Creado', value: new Date(r.createdAt).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }), light: true }
    ];
    if (r.updatedAt) {
      items.push({ label: 'Actualizado', value: new Date(r.updatedAt).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }), light: true });
    }
    if (r.comment) {
      items.push({ label: 'Comentario', value: r.comment, wide: true });
    }
    return items;
  }

  statusLabel(status: RequestStatus): string {
    const map: Record<RequestStatus, string> = {
      PENDING: 'Pendiente', APPROVED: 'Aprobado', REJECTED: 'Rechazado'
    };
    return map[status];
  }
}
