import DonationService from 'donation-service';
import { Aurelia, inject } from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Aurelia, DonationService, Router)
export class Logout {
  heading = 'Logout';

  constructor(Aurelia, DonationService, Router) {
    this.aurelia = Aurelia;
    this.donationService = DonationService;
    this.router = Router;
  }

  logout(){
    console.log ('logging out');
    this.donationService.logout();
    this.aurelia.setRoot('app').then(() => {
      this.router.navigateToRoute('welcome');
    }) .catch(() => {
      logger.error('Error setting root to "home"');
    });
  }
}

