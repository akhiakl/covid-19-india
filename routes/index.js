'use strict';

module.exports = function (app) {
  app.use('/', require('./api/home'));
  app.use('/scrape', require('./api/scrape'));
}