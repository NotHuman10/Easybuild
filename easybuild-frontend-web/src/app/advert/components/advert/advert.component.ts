import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageService } from '@app/core/services/image.service';
import { AdvertExtended } from '@shared/models/advert-extended';

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvertComponent implements OnInit {
  @Input() advert: AdvertExtended;
  @Input() tileMode: boolean = false;
  @Output() toggleFavorite: EventEmitter<boolean> = new EventEmitter<boolean>();
  imageUrl: string;

  constructor(private imageService: ImageService) { }
  
  ngOnInit(): void {
    this.imageUrl = this.imageService.getUrlFromId(this.advert.baseAdvert.imageId);
  }
}