/* eslint-disable no-console */

console.log('Running on production.');
var express = require('express');
var path = require('path');
var compression = require('compression');
var port = process.env.PORT || 8000;
var app = express();

app.use(compression());

app.get('/*.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    next();
});

app.get('/*.css', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/css');
    next();
});

app.use(express.static(__dirname + '/../dist'));

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

app.listen(port, function () {
    console.log("Server started on port " + port);
});
