var serverRender = require("../utils/serverRendering");

module.exports = function(app, passport) {
    
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        serverRender.handleRender(req, res);
    });

};