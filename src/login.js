import DonationService from 'donation-service';
import {Aurelia, inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Aurelia, DonationService, Router)
export class Login {
  email = 'homer@simpson.com';
  password = 'secret';
  response = ''

  constructor(Aurelia, DonationService, Router) {
    this.donationService = DonationService;
    this.aurelia = Aurelia;
    this.prompt = '';
  }

  login() {
    if (this.email && this.password) {
      this.donationService.login(this.email, this.password)
        .then(response => {
          console.log(response);
          if (response.success) {
            this.aurelia.setRoot('home');
          } else {
            this.prompt = response.message;
          }
        });
    }
    else {
      this.prompt = 'Please enter a valid username and password';
    }
  }
}

