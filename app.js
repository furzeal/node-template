const express = require('express');
const favicon = require('static-favicon');
const app = express();
const http = require('http');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const server = http.createServer(app);
const currentStatic = require('./gulp/config').root;
const config = require('./config.json');
const uploadDir = config.upload;
const flash = require('connect-flash');
const bcrypt = require('bcrypt-nodejs');

const mongoose = require('mongoose');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let passport = require('passport');

app.use(session({
    secret: 'nodejs-app',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

mongoose.Promise = global.Promise;

// mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
//     user: config.db.user,
//     pass: config.db.password
// }).catch(e => {
//     console.error(e);
//     throw e;
// });

mongoose.connect(config.connection.string);
console.log(mongoose);

// Error handler
mongoose.connection.on('error', function (err) {
    console.log(err)
})

// pass passport for configuration
require('./passport/passport')(passport);

// models
require('./models/template');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(favicon(path.join(__dirname, currentStatic, '/favicon.ico')));
app.use(favicon());
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json('secretString'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, currentStatic)));

// remember me
app.use( function (req, res, next) {
    if ( req.method == 'POST' && req.url == '/login' ) {
        console.log(req.body.rememberme);
        if ( req.body.rememberme ) {
            req.session.cookie.maxAge = 7776000000; // 3*30*24*60*60*1000 Rememeber 'me' for 90 days
        } else {
            req.session.cookie.expires = false;
        }
    }
    next();
});

// passport
app.use(passport.initialize());
app.use(passport.session());

//routes ======================================================================
require('./controllers/routes.js')(app, passport); // Basic routes load our routes and pass in our app and fully configured passport

//app.use('/', require('./routes/index')(app,passport));
//require('./routes/index');

// app.use('/template', require('./routes/template'));
// app.use('/admin', require('./routes/admin'));
// app.use('/admin/template', require('./routes/admin/template'));


// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404).render('pages/404');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('pages/500');
});

// start server
server.listen(3000, '0.0.0.0');
server.on('listening', function () {

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    console.log('Express server started on port %s at %s', server.address().port);
});

module.exports = app;
