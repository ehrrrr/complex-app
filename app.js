const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const app = express();
const router = require('./router');

let sessionOptions = session({
    secret: "JavaScript is so cool",
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24,
        httpOnly: true
    }
});

app.use(flash());
app.use(sessionOptions);
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.use(function(req, res, next) {
    // make all error and success flash messages available from all templates
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    
    //make current user id available on the req object
    if(req.session.user) {
        req.visitorId = req.session.user._id;
    } else {
        req.visitorId = 0;
    }

    //make user session data available from within view templates 
    res.locals.user = req.session.user;
    next();
});

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);

module.exports = app;