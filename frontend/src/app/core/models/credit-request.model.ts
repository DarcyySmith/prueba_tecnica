export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreditRequest {
  id: number;
  amount: number;
  termMonths: number;
  applicantId: string;
  status: RequestStatus;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCreditRequestDto {
  amount: number;
  termMonths: number;
  applicantId: string;
}

export interface UpdateStatusDto {
  status: RequestStatus;
  comment?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
