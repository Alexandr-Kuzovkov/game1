/*тестовый сервер*/

var argv = process.argv;
if ( argv.length < 3 ){
	console.log("Usage: node server <port> ");
	process.exit(0);
 }

var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = parseInt(argv[2]);
var handler = require('./handler');
var Helper = require('./helper');
var bodyParser = require('body-parser');

server.listen(port,function(){
    console.log('Test server start at port '+port+ ' ' + Helper.getTime());
});


app.use(bodyParser.urlencoded({ extended: false }));


/*маршрут для GET запроса / */
app.get('/',handler.index);

/*маршрут для GET запроса route1*/
app.get('/route1', handler.route1);


/*маршрут для GET запроса /route2*/
app.get('/route2',handler.route2);

/*маршрут для GET запроса /find*/
app.get('/find',handler.find);



