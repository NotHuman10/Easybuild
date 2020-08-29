import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { Advert } from '@app/shared/models/advert';
import { ImageService } from '@core/services/image.service';
import { JobCategoryService } from '@core/services/job-category.service';
import { NotificationService } from '@core/services/notification.service';
import { environment } from '@env/environment';
import { JobCategory } from '@shared/models/job-category';
import { JobProposal } from '@shared/models/job-proposal';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AdvertService } from '../../../core/services/advert.service';
import { UserRole } from '@app/shared/models/enums';

@Component({
  selector: 'app-advert-create', 
  templateUrl: './advert-create.component.html',
  styleUrls: ['./advert-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvertCreateComponent {
  jobCategories$: Observable<JobCategory[]>;
  addedProposals: JobProposal[] = [];
  appropriateAddressType: string;

  basicInfoForm = new FormGroup({
    'image': new FormControl(),
    'title': new FormControl(),
    'description': new FormControl(),
    'address': new FormControl()
  });

  proposalForm = new FormGroup({
    'jobCategories': new FormControl([], Validators.required),
    'name': new FormControl(),
    'pricingUnit': new FormControl(),
    'price': new FormControl(),
    'amount': new FormControl()
  });

  get jobCategoriesControlShowError(): boolean {
    let control = this.proposalForm.controls['jobCategories'];
    return control.touched && control.invalid;
  }

  constructor(
    private jobCategoryService: JobCategoryService,
    private authService: AuthService,
    private imageService: ImageService,
    private advertService: AdvertService,
    private notificationService: NotificationService,
    private router: Router) { }

  ngOnInit(): void {
    this.jobCategories$ = this.jobCategoryService.getCategories();
    let role = this.authService.identity.roleId;
    this.appropriateAddressType = role == UserRole.Customer
      ? "Write Construction Site Address"
      : "Write your business address";

    //TODO: Add business address to UserIdentity and perform autofill
  }

  addProposal(): void {
    if(this.proposalForm.invalid) {
      this.proposalForm.controls['jobCategories'].markAsTouched();
      return;
    }

    let controls = this.proposalForm.controls;
    let proposal: JobProposal = {
      id: 0,
      advertId: 0,
      name: controls["name"].value,
      pricingUnit: controls["pricingUnit"].value,
      price: controls["price"].value,
      amount: controls["amount"].value,
      jobCategory: controls["jobCategories"].value[0],
      jobCategoryId: controls["jobCategories"].value[0].id
    };

    this.addedProposals.push(proposal);
  }

  removeProposal(proposal: JobProposal): void {
    let idx = this.addedProposals.indexOf(proposal);
    this.addedProposals.splice(idx, 1);
  }

  createAdvert(): void {
    let imgData = this.basicInfoForm.get('image').value;
    this.imageService.postImage(imgData)
      .pipe(concatMap(imgId => {
        return this.advertService.create(this.prepareRequest(imgId))
      }))
      .subscribe(() => {
        this.notificationService.showSuccess("Advert created");
        this.router.navigate([environment.homeRoute]);
      });
  }

  private prepareRequest(imgId: string): Advert {
    return {
      id: 0,
      userId: this.authService.identity.id,
      jobProposals: this.addedProposals,
      title: this.basicInfoForm.controls['title'].value,
      description: this.basicInfoForm.controls['description'].value,
      createdDate: new Date().toJSON(),
      closed: false,
      imageId: imgId,
      address: this.basicInfoForm.controls['address'].value
    };
  }
}