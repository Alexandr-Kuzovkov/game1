/*игровой сервер*/
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 8000;
var Helper = require('./modules/helper');
var sdata = require('./modules/sdata');
var controller = require('./modules/controller');
global.sdata = sdata;
global.helper = Helper;
var Handler = require('./modules/handler');
var cons = require('consolidate');
var locations  = require('./modules/locations').locations;
global.locations = locations;

var elevation = require('./services/elevation/elevation'); /*подключение модуля высот*/
var weather = require('./services/weather/weather'); /*подключение модуля погоды*/


server.listen(port,function(){
    console.log('Game server start at port '+port+ ' ' + Helper.getTime());
});

/* настройки для рендеринга шаблонов*/
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views',__dirname+'/public/views');

/* подключение каталога статических файлов, cookies, bodyParser */
app.use(express.static(__dirname+'/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

/*основной маршрут*/
app.get('/', controller.index );

/*установка обработчика на url /location/:loc*/
for ( var key in locations){
    app.get('/location/:id', controller.location);
    var game = new sdata.Game(locations[key]);
    sdata.games[key] = game;
    
    /*обработчики событий модуля socket.io*/
    io.of('/location/'+key).on('connection',function(socket){
        Handler.get_game(socket, sdata);
        Handler.join_user(socket, sdata);
        Handler.data_from_client(socket, sdata);
        Handler.getnearestnode(socket, sdata); 
        Handler.getroute(socket, sdata);        
    });
}

elevation.startUpdateElevation(sdata.games, locations);
weather.startUpdateWeather(sdata.games, locations);







