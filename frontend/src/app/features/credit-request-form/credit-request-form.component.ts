import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CreditRequestService } from '../../core/services/credit-request.service';

@Component({
  selector: 'app-credit-request-form',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
  templateUrl: './credit-request-form.component.html',
  styleUrls: ['./credit-request-form.component.scss']
})
export class CreditRequestFormComponent {

  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private service: CreditRequestService,
    private router: Router
  ) {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(500), Validators.max(50000)]],
      termMonths: [null, [Validators.required, Validators.min(6), Validators.max(60)]],
      applicantId: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.service.create(this.form.value).subscribe({
      next: (res) => this.router.navigate(['/requests', res.id]),
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear la solicitud';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/requests']);
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.touched && control?.hasError(error));
  }
}
