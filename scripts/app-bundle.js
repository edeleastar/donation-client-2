define('app',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia), _dec(_class = function () {
    function App(Aurelia) {
      _classCallCheck(this, App);

      this.aurelia = Aurelia;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Donation';

      config.map([{ route: ['', 'welcome'], name: 'welcome', moduleId: 'welcome', nav: true, title: 'Welcome' }, { route: 'login', name: 'login', moduleId: 'login', nav: true, title: 'Login' }, { route: 'signup', name: 'signup', moduleId: 'signup', nav: true, title: 'Signup' }]);

      config.mapUnknownRoutes(function (instruction) {
        return 'welcome';
      });

      this.router = router;
    };

    return App;
  }()) || _class);
});
define('config',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    baseUrl: 'https://enigmatic-coast-32556.herokuapp.com',
    loginUrl: 'api/authenticate',
    tokenName: 'donation'
  };
});
define('donate',['exports', 'aurelia-framework', 'aurelia-http-client', 'donation-service', 'config'], function (exports, _aureliaFramework, _aureliaHttpClient, _donationService, _config) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Donate = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  var _config2 = _interopRequireDefault(_config);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Donate = exports.Donate = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _donationService2.default), _dec(_class = function () {
    function Donate(http, DonationService) {
      _classCallCheck(this, Donate);

      this.heading = 'Donate';
      this.candidates = [];
      this.selectedCandidate = {};
      this.methods = ["Cash", "PayPal"];
      this.selectedMethod = 1;

      this.donationService = DonationService;
    }

    Donate.prototype.activate = function activate() {
      var _this = this;

      this.donationService.getCandidates().then(function (response) {
        _this.candidates = response.content;
      });
    };

    Donate.prototype.makeDonation = function makeDonation() {
      this.donationService.donate(this.amount, this.selectedMethod, this.selectedCandidate).then(function (response) {
        console.log('Saved donation id:' + response.content._id);
      }).catch(function (error) {
        console.log('Error saving Donation');
      });
    };

    return Donate;
  }()) || _class);
});
define('donation-service',['exports', 'aurelia-framework', 'aurelia-http-client', 'config'], function (exports, _aureliaFramework, _aureliaHttpClient, _config) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _config2 = _interopRequireDefault(_config);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var DonationService = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _aureliaHttpClient.HttpClient), _dec(_class = function () {
    function DonationService(Aurelia, HttpClient) {
      _classCallCheck(this, DonationService);

      this.session = null;

      HttpClient.configure(function (http) {
        http.withBaseUrl(_config2.default.baseUrl);
      });
      this.http = HttpClient;
      this.app = Aurelia;
    }

    DonationService.prototype.configureSession = function configureSession() {
      var _this = this;

      this.session = JSON.parse(localStorage[_config2.default.tokenName] || null);

      if (this.session) {
        (function () {
          var token = localStorage[_config2.default.tokenName];
          var tokenObj = JSON.parse(token);
          _this.http.configure(function (config) {
            config.withHeader('Authorization', 'bearer ' + tokenObj.token);
          });
        })();
      }
    };

    DonationService.prototype.login = function login(email, password) {
      var _this2 = this;

      return this.http.post(_config2.default.loginUrl, { email: email, password: password }).then(function (response) {
        var a = _this2;
        return new Promise(function (resolve, reject) {
          if (response.content.success) {
            localStorage[_config2.default.tokenName] = JSON.stringify(response.content);
            a.http.configure(function (config) {
              config.withHeader('Authorization', 'bearer ' + response.content.token);
              a.session = response.content.token;
            });
          }
          resolve(response.content);
        });
      }).catch(function (error) {
        console.log(error);
      });
    };

    DonationService.prototype.logout = function logout() {
      localStorage[_config2.default.tokenName] = null;
      this.session = null;
    };

    DonationService.prototype.isAuthenticated = function isAuthenticated() {
      return this.session !== null;
    };

    DonationService.prototype.getCandidates = function getCandidates() {
      return this.http.get('/api/candidates');
    };

    DonationService.prototype.getDonations = function getDonations() {
      return this.http.get('/api/donations');
    };

    DonationService.prototype.donate = function donate(amount, method, candidate) {
      console.log(amount + ' donated to ' + candidate.firstName + ' ' + candidate.lastName + ': ' + method);

      var donation = {
        amount: amount,
        method: method
      };

      return this.http.post('/api/candidates/' + candidate._id + '/donations', donation);
    };

    return DonationService;
  }()) || _class);
  exports.default = DonationService;
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('home',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Home = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Home = exports.Home = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia), _dec(_class = function () {
    function Home(aurelia) {
      _classCallCheck(this, Home);

      this.aurelia = aurelia;
    }

    Home.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Donation';
      config.map([{ route: ['', 'home'], name: 'donate', moduleId: 'donate', nav: true, title: 'Donate', auth: true }, { route: 'report', name: 'report', moduleId: 'report', nav: true, title: 'Report', auth: true }, { route: 'logout', name: 'logout', moduleId: 'logout', nav: true, title: 'Logout', auth: true }]);

      config.mapUnknownRoutes(function (instruction) {
        return 'donate';
      });

      this.router = router;
    };

    return Home;
  }()) || _class);
});
define('login',['exports', 'donation-service', 'aurelia-framework', 'aurelia-router'], function (exports, _donationService, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _donationService2.default, _aureliaRouter.Router), _dec(_class = function () {
    function Login(Aurelia, DonationService, Router) {
      _classCallCheck(this, Login);

      this.email = 'homer@simpson.com';
      this.password = 'secret';
      this.response = '';

      this.donationService = DonationService;
      this.aurelia = Aurelia;
      this.prompt = '';
    }

    Login.prototype.login = function login() {
      var _this = this;

      if (this.email && this.password) {
        this.donationService.login(this.email, this.password).then(function (response) {
          console.log(response);
          if (response.success) {
            _this.aurelia.setRoot('home');
          } else {
            _this.prompt = response.message;
          }
        });
      } else {
        this.prompt = 'Please enter a valid username and password';
      }
    };

    return Login;
  }()) || _class);
});
define('logout',['exports', 'donation-service', 'aurelia-framework', 'aurelia-router'], function (exports, _donationService, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Logout = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _donationService2.default, _aureliaRouter.Router), _dec(_class = function () {
    function Logout(Aurelia, DonationService, Router) {
      _classCallCheck(this, Logout);

      this.heading = 'Logout';

      this.aurelia = Aurelia;
      this.donationService = DonationService;
      this.router = Router;
    }

    Logout.prototype.logout = function logout() {
      var _this = this;

      console.log('logging out');
      this.donationService.logout();
      this.aurelia.setRoot('app').then(function () {
        _this.router.navigateToRoute('welcome');
      }).catch(function () {
        logger.error('Error setting root to "home"');
      });
    };

    return Logout;
  }()) || _class);
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('report',['exports', 'aurelia-framework', 'donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Report = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Report = exports.Report = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Report(DonationService) {
      _classCallCheck(this, Report);

      this.heading = 'Report';
      this.donations = [];

      this.donationService = DonationService;
    }

    Report.prototype.activate = function activate() {
      var _this = this;

      this.donationService.getDonations().then(function (response) {
        _this.donations = response.content;
      });
    };

    return Report;
  }()) || _class);
});
define('welcome',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Welcome = exports.Welcome = function () {
    function Welcome() {
      _classCallCheck(this, Welcome);

      this.heading = 'Welcome';
    }

    Welcome.prototype.activate = function activate() {};

    return Welcome;
  }();
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui container page-host\">\n    <nav-bar router.bind=\"router\"></nav-bar>\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!donate.html', ['module'], function(module) { module.exports = "<template>\n\n  <section class=\"ui raised segment\">\n\n    <section class=\"ui raised segment\">\n      <div class=\"ui grid \">\n        <div class=\"ui form six wide column\">\n          <div class=\"ui stacked segment\">\n            <form submit.trigger=\"makeDonation()\">\n              <div class=\"grouped inline fields\">\n                <h3>Enter Amount </h3>\n                <div class=\"field\">\n                  <label>Amount</label> <input type=\"number\" value.bind=\"amount\" >\n                </div>\n              </div>\n              <div class=\"grouped inline fields\">\n                <h3> Select Method </h3>\n                <div class=\"field\" repeat.for=\"method of methods\">\n                  <div class=\"ui radio checkbox\">\n                    <input type=\"radio\" model.bind=\"method\" checked.bind=\"$parent.selectedMethod\">\n                    <label>${method}</label>\n                  </div>\n                </div>\n              </div>\n              <div class=\"grouped inline fields\">\n                <h3> Select Candidate </h3>\n                <div class=\"field\" repeat.for=\"candidate of candidates\">\n                  <div class=\"ui radio checkbox\">\n                    <input type=\"radio\" model.bind=\"candidate\" checked.bind=\"$parent.selectedCandidate\">\n                    <label>${candidate.lastName}, ${candidate.firstName}</label>\n                  </div>\n                </div>\n              </div>\n              <button class=\"ui blue submit button\">Donate</button>\n            </form>\n          </div>\n        </div>\n        <aside class=\"six wide column\">\n          <img src=\"images/homer4.jpeg\" class=\"ui medium image\">\n        </aside>\n      </div>\n    </section>\n    <div class=\"ui  divider\"></div>\n      <div class=\"ui teal progress\" data-percent=\"${progress}\" id=\"mainprogress\">\n        <div class=\"bar\"></div>\n      </div>\n    </section>\n\n  </template>\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui container page-host\">\n    <nav-bar router.bind=\"router\"></nav-bar>\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!login.html', ['module'], function(module) { module.exports = "<template>\n  <section class=\"ui raised segment\">\n    <div class=\"ui grid\">\n      <aside class=\"ui six wide column\">\n        <img src=\"images/homer2.png\" class=\"ui medium image\">\n      </aside>\n      <div class=\"ui ten wide column fluid form\">\n        <div class=\"ui stacked segment\">\n          <form submit.delegate=\"login($event)\">\n            <h3 class=\"ui header\">Log-in</h3>\n            <div class=\"field\">\n              <label>Email</label> <input placeholder=\"Email\" value.bind=\"email\" />\n            </div>\n            <div class=\"field\">\n              <label>Password</label> <input type=\"password\" value.bind=\"password\" />\n            </div>\n            <button class=\"ui blue submit button\">Login</button>\n          </form>\n          <h3>${prompt}</h3>\n\n        </div>\n      </div>\n    </div>\n  </section>\n\n</template>\n"; });
define('text!logout.html', ['module'], function(module) { module.exports = "<template class=\"ui container\">\n  <section class=\"ui stacked segment\">\n    <div class=\"ui grid\">\n      <aside class=\"six wide column\">\n        <img src=\"images/homer.png\" class=\"ui medium image\">\n      </aside>\n      <div class=\"ui ten wide column fluid form\">\n        <div class=\"ui stacked segment\">\n          <form submit.delegate=\"logout($event)\">\n            <h3 class=\"ui header\">Are you sure you want to log out?</h3>\n            <button class=\"ui blue submit button\">Logout</button>\n          </form>\n        </div>\n      </div>\n    </div>\n  </section>\n</template>\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <nav class=\"ui inverted menu\">\n    <header class=\"header item\"><a href=\"/\"> Donation </a></header>\n    <div class=\"right menu\">\n      <li repeat.for=\"row of router.navigation\">\n        <a class=\"${row.isActive ? 'active' : ''} item\"  href.bind=\"row.href\">${row.title}</a>\n      </li>\n    </div>\n  </nav>\n</template>\n"; });
define('text!report.html', ['module'], function(module) { module.exports = "<template>\n  <section class=\"ui raised segment\">\n    <div class=\"ui grid\">\n      <aside class=\"six wide column\">\n        <img src=\"images/homer5.jpg\" class=\"ui medium image\">\n      </aside>\n      <article class=\"eight wide column\">\n        <table class=\"ui celled table segment\">\n          <thead>\n            <tr>\n              <th>Amount</th>\n              <th>Method donated</th>\n              <th>Donor</th>\n              <th>Candidate</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr repeat.for=\"donation of donations\">\n              <td> ${donation.amount} </td>\n              <td> ${donation.method} </td>\n              <td> ${donation.donor.firstName} ${donation.donor.lastName} </td>\n              <td> ${donation.candidate.lastName}, ${donation.candidate.firstName} </td>\n            </tr>\n          </tbody>\n        </table>\n      </article>\n    </div>\n  </section>\n</template>\n"; });
define('text!welcome.html', ['module'], function(module) { module.exports = "<template class=\"ui container\">\n  <section class=\"ui stacked segment\">\n    <div class=\"ui grid\">\n      <aside class=\"six wide column\">\n        <img src=\"images/homer.png\" class=\"ui medium image\">\n      </aside>\n      <article class=\"ten wide column\">\n        <header class=\"ui  header\"> Help Me Run Springfield</header>\n        <p> Donate what you can now - No Bitcoins accepted! </p>\n      </article>\n    </div>\n  </section>\n </template>\n"; });
//# sourceMappingURL=app-bundle.js.map