const functions = require('firebase-functions');
const express = require('express');
const app = express();

var fs = require('fs');
var template = require('./lib/template.js');


app.get('/timestamp', (req, res) => {
    res.send(`${Date.now()}`);
});

app.get('/example', (req, res) => {
    fs.readdir('./data', function (error, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        res.send(html);
    });
});


exports.app = functions.https.onRequest(app);