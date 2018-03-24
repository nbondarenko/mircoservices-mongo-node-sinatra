const bikesRoutes = require('./bikes_routes');
module.exports = function (app, db) {
  bikesRoutes(app, db);
};