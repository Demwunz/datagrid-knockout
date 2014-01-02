var gzippo = require('gzippo'),
    express = require('express'),
    path = require('path'),
    app = express();

app.use(express.logger('dev'));
app.use(gzippo.staticGzip("" + __dirname + "/dist"));
app.listen(process.env.PORT || 5000);

console.log('Your app is now running at: http://127.0.0.1:3000/');