/*серверный модуль обработчиков событий при взаимодействии клиентов и сервера*/

var httpRequest = require('./httprequest');
/**
* обработчик события получения данных от клиента для синхронизации
* объекта game
* генерация событий data_from_server и отправка данных клиенту для 
* синхронизации его объекта game с серверным объектом game
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объекты games и users 
**/
function data_from_client(socket,sdata){
    socket.on('data_from_client',function(data){
        if ( sdata.games[data.location] ){
            sdata.games[data.location].updateUserTime(data.user);
            sdata.games[data.location].sync(data.game);
            sdata.games[data.location].actionsLoop();
            if ( !sdata.games[data.location].checkGameOver(data.user.id)){
                socket.emit('data_from_server',{game:sdata.games[data.location].toString()}); 
            }else{
                socket.emit('game_over');                    
            }
        }
    });
}



/**
* обработчик события запроса серверного объекта game клиентом 
* генерация событий send_game и посылка данных серверного объекта game
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объекты games и users 
**/
function get_game( socket, sdata ){
   socket.on('get_game', function(data){
       var location = data.location.slice(10);
       console.log('get_game:location='+location);
       if (sdata.games[location].users[data.user.id] == undefined){
            socket.emit('new_game', {game:sdata.games[location].toString(), location:locations[location]}); 
       }else{
            socket.emit('resume_game', {game:sdata.games[location].toString()}); 
       }
       
    }); 
}

/**
* обработчик события запроса клиента на добавление клиента в игру
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объекты games и users
**/
function join_user( socket, sdata ){
    socket.on('join_user', function(data){
        sdata.games[data.location].joinUser(data.units, data.user, function(){
            socket.emit('client_refresh_by_server');
            socket.broadcast.emit('updategame',{game:sdata.games[data.location].toString()});
            sdata.games[data.location].addLogMessage(data.user.name + 'join_to_game');
        });
    });
}


/**
* обработчик события запроса клиента на определение координат узла графа 
* ближайшего к заданной точке
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объекты games и users
**/
function getnearestnode( socket, sdata ){
    socket.on('getnearestnode', function(data){
        var geoserver = sdata.games[data.location].location.geoserver;
        httpRequest.get(geoserver+'/getnearestnode?data='+JSON.stringify(data.latlng), function(data){
            console.log('data='+JSON.stringify(data));
            socket.emit('takenearestnode',{latlng:data});
        });
    });
}

/**
* обработчик события запроса клиента на получение маршрута
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объекты games и users
**/
function getroute( socket, sdata ){
    socket.on('getroute', function(data){
        var geoserver = sdata.games[data.location].location.geoserver;
        httpRequest.get(geoserver+'/routespatialite?data='+JSON.stringify([data.start,data.end]), function(route){
            console.log('data='+JSON.stringify(data));
            socket.emit('takeroute',{route:route,id:data.id});
        });
    });
}

/**
* обработчик события запроса клиента на добавление юнита в игру
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объекты games и users
**/
function add_unit( socket, sdata ){
    socket.on('add_unit', function(data){
        var added_unit_id = sdata.games[data.location].addUnit(data.unit);
        var parent_id = data.id;
        socket.emit('unit_added',{parent_id:parent_id, added_unit_id:added_unit_id});
    });
}

/**
* обработчик события запроса клиента на удаление юнита из игры
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объекты games и users
**/
function del_unit( socket, sdata ){
    socket.on('del_unit', function(data){
        var deleted_unit_id = sdata.games[data.location].delUnit(data.id);
        socket.emit('unit_deleted',{parent_id:data.parent_id, deleted_unit_id:deleted_unit_id});
    });
}


exports.data_from_client = data_from_client;
exports.get_game = get_game;
exports.join_user = join_user;
exports.getnearestnode = getnearestnode;
exports.getroute = getroute;
exports.add_unit = add_unit;
exports.del_unit = del_unit;
