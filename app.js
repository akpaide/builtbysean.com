
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , taylorhouse = require('./routes/taylorhouse')
  , minisites = require('./routes/minisites')
  , http = require('http')
  , path = require('path')
  , socketio = require('socket.io');

var app = express();

// all environments
app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


//404
app.use(function(req, res, next){
  res.render('404', { status: 404, url: req.url, title: '404: page not found' });
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/work', routes.work);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/minisites', minisites.index);
app.get('/minisites/coin', minisites.coin);
app.get('/minisites/energy', minisites.energy);
app.get('/minisites/petrol', minisites.petrol);
app.get('/taylorhouse', taylorhouse.index);
app.get('/taylorhouse/chat', taylorhouse.chat);

var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'Welcome to the chat!' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});


