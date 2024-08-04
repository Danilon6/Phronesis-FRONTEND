import { Component } from '@angular/core';
import { IAdvert } from '../../models/i-advert';
import { AdsService } from '../../services/ads.service';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss'
})
export class AdsComponent {
  advertArr: IAdvert[] = [];
  randomAdverts: IAdvert[] = [];

  constructor(private adsService: AdsService) {}

  ngOnInit(): void {
    this.adsService.advert$.subscribe(adverts => {
      this.advertArr = adverts;
      this.randomAdverts = this.getRandomAdverts(this.advertArr, 2);
    });
  }

  getRandomAdverts(adverts: IAdvert[], count: number): IAdvert[] {
    const randomAdverts: IAdvert[] = [];
    const usedIndices: Set<number> = new Set();

    while (randomAdverts.length < count && usedIndices.size < adverts.length) {
      const randomIndex = Math.floor(Math.random() * adverts.length);

      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        randomAdverts.push(adverts[randomIndex]);
      }
    }

    return randomAdverts;
  }
}
