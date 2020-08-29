import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Contract } from '@shared/models/contract';
import { ContractCreateModel } from '@shared/models/contract-create';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ContractService {
  constructor(private http: HttpClient) { }

  create(model: ContractCreateModel): Observable<number> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    return this.http.post(environment.apiUrl + 'contract', model, { headers: headers })
      .pipe(map(r => r as number))
  }

  getAll(): Observable<Contract[]> {
    return this.http.get(environment.apiUrl + 'contract/list')
      .pipe(map(r => r as Contract[]));
  }

  getReport(contractId: number): Observable<Blob> {
    return this.http.get(environment.apiUrl + 'contract/' + contractId + '/report', { responseType: 'blob' })
      .pipe(map((r: Blob) => new Blob([r], { type: 'application/pdf' })));
  }
}