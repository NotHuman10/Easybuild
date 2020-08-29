import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdvertService } from '@app/core/services/advert.service';
import { SharedModule } from '@app/shared/shared.module';
import { ContractListComponent } from './components/contract-list/contract-list.component';
import { CreateContractComponent } from './components/create-contract/create-contract.component';
import { ContractRoutingModule } from './contract-routing.module';
import { ContractService } from './services/contract.service';

@NgModule({
  declarations: [CreateContractComponent, ContractListComponent],
  imports: [
    CommonModule,
    SharedModule,
    ContractRoutingModule
  ],
  providers: [
    ContractService,
    AdvertService
  ]
})
export class ContractModule { }