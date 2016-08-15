import {Aurelia, inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import config from 'config';

@inject(Aurelia, HttpClient)
export default class DonationService {
  session = null;

  constructor(Aurelia, HttpClient) {
    HttpClient.configure(http => {
      http.withBaseUrl(config.baseUrl);
    });
    this.http = HttpClient;
    this.app = Aurelia;

    //this.configureSession();
  }

  configureSession() {
    this.session = JSON.parse(localStorage[config.tokenName] || null);

    if (this.session) {
      const token = localStorage[config.tokenName];
      const tokenObj = JSON.parse(token);
      this.http.configure(config => {
        config.withHeader('Authorization', 'bearer ' + tokenObj.token);
      });
    }
  }

  login(email, password) {
    return this.http.post(config.loginUrl, { email, password })
      .then(response => {
        var a = this;
        return new Promise(function (resolve, reject) {
          if (response.content.success) {
            localStorage[config.tokenName] = JSON.stringify(response.content);
            a.http.configure(config => {
              config.withHeader('Authorization', 'bearer ' + response.content.token);
              a.session = response.content.token;
            });
          }
          resolve(response.content);
        });
      })
      .catch (error => {
        console.log (error);
      });
  }

  logout() {
    localStorage[config.tokenName] = null;
    this.session = null;
  }

  isAuthenticated() {
    return this.session !== null;
  }

  getCandidates() {
    return this.http.get('/api/candidates');
  }


  getDonations() {
    return this.http.get('/api/donations');
  }

  donate(amount, method, candidate) {
    console.log(amount + ' donated to ' + candidate.firstName + ' ' + candidate.lastName + ': ' + method);

    let donation = {
      amount: amount,
      method: method,
    };

    return this.http.post('/api/candidates/' + candidate._id + '/donations', donation);
  }
}
