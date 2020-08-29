import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdvertService } from '@app/core/services/advert.service';
import { AuthService } from '@app/auth/auth.service';
import { ContractService } from '@app/contract/services/contract.service';
import { NotificationService } from '@app/core/services/notification.service';
import { AdvertExtended } from '@app/shared/models/advert-extended';
import { ContractCreateModel } from '@app/shared/models/contract-create';
import { UserRole } from '@app/shared/models/enums';
import { UserIdentity } from '@app/shared/models/user-identity';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateContractComponent implements OnInit {
  advert$: Observable<AdvertExtended>;
  tomorrow: Date;

  proposalsForm = new FormGroup({
    "proposals": new FormArray([], Validators.required),
    "expirationDate": new FormControl()
  });

  constructor(
    private advertService: AdvertService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private location: Location,
    private contractService: ContractService,
    private notificationService: NotificationService,
    private router: Router) {
    this.tomorrow = new Date();
    this.tomorrow.setDate(new Date().getDate() + 1);
  }

  ngOnInit(): void {
    let advertId = this.activatedRoute.snapshot.queryParamMap.get('advertId');
    this.advert$ = this.advertService.getAdvert(Number(advertId))
      .pipe(tap(advert => {
        let formArray = <FormArray>this.proposalsForm.controls["proposals"];
        formArray.clear();
        advert.baseAdvert.jobProposals.forEach(p => formArray.push(new FormControl(p)));
        if(this.authService.identity.roleId == UserRole.Customer) {
          this.proposalsForm.addControl("constructionSiteAddress", new FormControl(advert.baseAdvert.address))
        }
      }));
  }

  removeProposal(i: number): void {
    let formArray = <FormArray>this.proposalsForm.controls["proposals"];
    formArray.removeAt(i);
  }

  submit(advertCreator: UserIdentity): void {
    let proposals = this.proposalsForm.controls['proposals'].value;
    let model: ContractCreateModel = {
      userId: advertCreator.id,
      proposals: proposals,
      expirationDate: this.proposalsForm.controls['expirationDate'].value,
      constructionSiteAddress: this.proposalsForm.controls['constructionSiteAddress']?.value
    };

    this.contractService.create(model).subscribe(() => {
      this.notificationService.showSuccess(
        "Created",
        `Contract successfully created and waiting for ${advertCreator.name}'s review`);

        this.router.navigate([environment.homeRoute])
    });
  }

  goBack(): void {
    this.location.back();
  }
}