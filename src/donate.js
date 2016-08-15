import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import DonationService from 'donation-service';
import config from 'config';

@inject(HttpClient, DonationService)
export class Donate {
  heading = 'Donate';

  candidates = [];
  selectedCandidate = {};

  methods = ["Cash", "PayPal"];
  selectedMethod = 1;

  constructor(http, DonationService) {
    this.donationService = DonationService;
  }

  activate() {
    this.donationService.getCandidates()
      .then(response => {
        this.candidates = response.content;
      });
  }

  makeDonation() {
    this.donationService.donate(this.amount,  this.selectedMethod, this.selectedCandidate)
      .then(response => {
        console.log('Saved donation id:' + response.content._id);
      })
      .catch(error => {
        console.log('Error saving Donation');
      });
  }
}
