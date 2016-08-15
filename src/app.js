import { inject, Aurelia } from 'aurelia-framework';

@inject(Aurelia)
export class App {
  constructor(Aurelia) {
    this.aurelia = Aurelia;
  }

  configureRouter(config, router) {
    config.title = 'Donation';

    config.map([
      { route: ['', 'welcome'], name: 'welcome',       moduleId: 'welcome',       nav: true, title: 'Welcome' },
      { route: 'login',         name: 'login',         moduleId: 'login',         nav: true, title: 'Login'  },
      { route: 'signup',        name: 'signup',        moduleId: 'signup',        nav: true, title: 'Signup' },
    ]);

    config.mapUnknownRoutes(instruction => {
      return 'welcome';
    });

    this.router = router;
  }
}
