var http = require('http');
var WEATHER_SERVICE_HOSTNAME = '127.0.0.1'; /*���� ������� ������*/
var WEATHER_SERVICE_PORT = 8004; /*���� ������� ������*/

function updateWeater(){
    var dots = prepareDots(game);
    getWeather(dots, function(result){
            updateGameObject(game, result, callback);
    });   
    
    
}

