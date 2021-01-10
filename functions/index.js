const functions = require('firebase-functions');
const express = require('express');
const app = express();

app.use(express.static("public"));

app.get('/timestamp', (req, res) => {
    res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello world!</h1>
</body>
</html>
    `);
});

exports.app = functions.https.onRequest(app);