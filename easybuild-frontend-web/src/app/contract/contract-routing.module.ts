import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractListComponent } from './components/contract-list/contract-list.component';
import { CreateContractComponent } from './components/create-contract/create-contract.component';

const contractRoutes: Routes = [
  {
    path: 'create',
    component: CreateContractComponent
  },
  {
    path: 'list',
    component: ContractListComponent
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(contractRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ContractRoutingModule { }