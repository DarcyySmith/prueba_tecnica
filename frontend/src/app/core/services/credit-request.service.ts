import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreditRequest, CreateCreditRequestDto, UpdateStatusDto, PageResponse, RequestStatus } from '../models/credit-request.model';

@Injectable({ providedIn: 'root' })
export class CreditRequestService {

  private readonly apiUrl = `${environment.apiUrl}/credit-requests`;

  constructor(private http: HttpClient) {}

  create(dto: CreateCreditRequestDto): Observable<CreditRequest> {
    return this.http.post<CreditRequest>(this.apiUrl, dto);
  }

  findAll(page = 0, size = 10, status?: RequestStatus): Observable<PageResponse<CreditRequest>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<PageResponse<CreditRequest>>(this.apiUrl, { params });
  }

  findById(id: number): Observable<CreditRequest> {
    return this.http.get<CreditRequest>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, dto: UpdateStatusDto): Observable<CreditRequest> {
    return this.http.patch<CreditRequest>(`${this.apiUrl}/${id}/status`, dto);
  }
}
