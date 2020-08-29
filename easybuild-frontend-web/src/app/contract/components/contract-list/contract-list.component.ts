import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Contract } from '@app/shared/models/contract';
import { ContractStatus } from '@app/shared/models/contract-status';
import { Observable } from 'rxjs';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractListComponent implements OnInit, OnDestroy {
  pdfFrameSrc: string;
  contracts$: Observable<Contract[]>;

  constructor(private contractService: ContractService, private dom: DomSanitizer) { }

  getStatusString(status: ContractStatus): string {
    return ContractStatus[status];
  }

  ngOnInit(): void {
    this.contracts$ = this.contractService.getAll();
  }

  showReportPdf(contractId: number): void {
    this.contractService.getReport(contractId).subscribe(res => {
      URL.revokeObjectURL(this.pdfFrameSrc);
      this.pdfFrameSrc = URL.createObjectURL(res);
      open(this.pdfFrameSrc, "_blank");
    });
  }

  ngOnDestroy(): void {
    URL.revokeObjectURL(this.pdfFrameSrc);
  }
}