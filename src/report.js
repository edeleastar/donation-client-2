import {inject} from 'aurelia-framework';
import DonationService from 'donation-service';

@inject(DonationService)
export class Report {
  heading = 'Report';

  donations = [];

  constructor(DonationService) {
    this.donationService = DonationService;
  }

  activate() {
    this.donationService.getDonations()
      .then(response => {
        this.donations = response.content;
      });
  }
}
