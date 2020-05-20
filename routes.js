// define routes to visit diff pages in web application
const routes = require('next-routes')();
routes
  .add('/home','/')
  .add('/rents/new', '/rents/new')
  .add('/rents/:rentalAddress', '/rents/show')
  .add('/auth', '/auth')
  .add('/logout', '/logout')
  .add('/rents/:rentalAddress/requests', '/rents/requests/index');

module.exports = routes;