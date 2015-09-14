/* global require */
var connect = require("connect");
var serverStatic = require("serve-static");
var port = 3000;
connect().use(serverStatic(__dirname)).listen(port);
console.log("Server has started at http://localhost:" + port);
