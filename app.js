'use strict';

var express = require('express');
var app = express();

module.exports = app; // esto es solo para testear mas facil

const { router } = require('./routes/index.js');
app.use(router);



// el condicional es solo para evitar algun problema de tipo EADDRINUSE con mocha watch + supertest + npm test.
if (!module.parent) app.listen(3000);