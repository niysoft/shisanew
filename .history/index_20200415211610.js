const express = require('express'),
    path = require('path'),
    helmet = require('helmet'),
    PORT = process.env.PORT || 3002,
    app = express(),
    cookieParser = require('cookie-parser'),
    util = require('util'),
    bodyParser = require("body-parser"),
    pageRoutes = require('./routes/pages'),
    apiRoutes = require('./routes/api'),
    session = require('express-session'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    errorhandler = require('errorhandler'),
    isProduction = process.env.NODE_ENV === 'production'
mongooseOptions = {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    //autoIncrement = require('mongoose-auto-increment'),
    connection = null,
    //connectionString = 'mongodb://LAPTOP-9BS8VT7R:27017,LAPTOP-9BS8VT7R:27018,LAPTOP-9BS8VT7R:27019/bingo9ja?replicaSet=rs'
    //connectionString = 'mongodb://LAPTOP-9BS8VT7R:27017,LAPTOP-9BS8VT7R:27018,LAPTOP-9BS8VT7R:27019/shisa?replicaSet=rs'
    connectionString = 'mongodb+srv://niyious:salaudeen@cluster0-dg3rp.mongodb.net/shisa?retryWrites=true&w=majority'
    //connectionString = 'mongodb://localhost:27017/bingo9ja';

if (isProduction) {
    connectionString = 'mongodb+srv://niyious:salaudeen@cluster0-dg3rp.mongodb.net/shisa?retryWrites=true&w=majority'
        //mongooseOptions = {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true},

    connection = mongoose.connect(connectionString, mongooseOptions).then(function() {
        initilizeScript(app) //module.exports.connection = connection
    }).catch(function(err) {
        console.log(err)
    });
} else {
    app.use(errorhandler());
    connection = mongoose.connect(connectionString, mongooseOptions)
    connection = mongoose.connect(connectionString, mongooseOptions).then(function() {
        initilizeScript(app) // module.exports.connection = connection
    }).catch(function(err) {
        console.log(err)
    });
}


function initilizeScript(app) {
    app.use(function(req, res, next) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
    });
    app.use(cors())
    app.use(helmet())
    app.use(cookieParser())
        /*app.use(session({secret: 'conduit', cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}));*/
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());

    app.use(require('morgan')('dev'));
    app
        .use(express.static(path.join(__dirname, 'public')))
        .set('views', path.join(__dirname, 'views'))
        .set('view engine', 'ejs')
        /*app.use('/', function (reg, res) {
            res.status(200).render('pages/index')
            return
        })*/
    app.use('/', pageRoutes);
    app.use('/api', apiRoutes);

    module.exports = {
        //connection: connection
        //app: app,
        //connectionString: connectionString
    };
    //console.log(connection)
   let server = app.listen(PORT, () => console.log(`Listening on ${PORT}`))
   server.timeout = 10*60*1000;
}