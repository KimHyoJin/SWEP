var express = require('express');
var session  = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var fs = require('fs');
var app      = express();
var port     = process.env.PORT || 80;
var port2    = 443;
var passport = require('passport');
var flash    = require('connect-flash');
var options = {
		key: fs.readFileSync('ssl/server.key'),
    		cert: fs.readFileSync('ssl/server.crt')
};
var http = require('http');
var https = require('https');
var busboy = require('connect-busboy');

// pass passport for configuration
require('./config/passport')(passport);

// Login & Join
var login = require('./routes/login');
// Video upload
var mediaupload = require('./routes/mediaupload.js');
// Video Hub
var mediahub = require('./routes/mediahub.js');
// Mypage
var mypage = require('./routes/mypage.js');
// Video Share
var mediashare = require('./routes/mediashare.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({
        secret: 'vidyapathaisalwaysrunning',
        resave: true,
        saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(busboy());

app.use('/', login);
app.get('/uploadvideo', mediaupload);
app.get('/videostore', mediahub);
app.get('/mypage', mypage);
app.get('/mediashare', mediashare);
app.get('/myvideo', mediahub);
app.get('/chatroom', mediashare);
app.post('/upload', mediaupload);
app.post('/startchat',mediashare);
app.post('/receivechat', mediashare);
app.post('/addFriend',mypage);


// logout
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

http.createServer(app).listen(port, function(){
  console.log("Http server listening on port " + port);
});


https.createServer(options, app).listen(port2, function(){
  console.log("Https server listening on port " + port2);
});
