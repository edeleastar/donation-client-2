import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class Home {

  constructor(aurelia) {
    this.aurelia = aurelia;
  }

  configureRouter(config, router) {
    config.title = 'Donation';
    config.map([
      { route: ['', 'home'], name: 'donate',        moduleId: 'donate',        nav: true, title: 'Donate' , auth: true },
      { route: 'report',        name: 'report',        moduleId: 'report',        nav: true, title: 'Report' , auth: true },
      { route: 'logout',        name: 'logout',        moduleId: 'logout',        nav: true, title: 'Logout' , auth: true },
    ]);

    config.mapUnknownRoutes(instruction => {
      return 'donate';
    });

    this.router = router;
  }
}
