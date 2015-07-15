/*серверный модуль обработчиков событий при взаимодействии клиентов и сервера*/


/**
* обработчик события получения данных от клиента для синхронизации
* объекта game
* генерация событий data_from_server и отправка данных клиенту для 
* синхронизации его объекта game с серверным объектом game
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
function data_from_client(socket,sdata){
    socket.on('data_from_client',function(data){
        if ( sdata.games[data.location] ){
            sdata.games[data.location].updateUserTime(data.user);
            sdata.games[data.location].sync(data.game);
            sdata.games[data.location].battleLoop();
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
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
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
* обработчик события запроса клиента на добавление юнитов в игру
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user
**/
function set_units( socket, sdata ){
    socket.on('set_units', function(data){
        sdata.games[data.location].joinUser(data.units, data.user, function(){
            socket.emit('client_refresh_by_server');
            socket.broadcast.emit('client_refresh_by_server');
        });
    });
}

/**
* отправка лог-сообщений по клиентам
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user
* @param mess строка сообщения
**/
function sendLogMessages(socket, sdata, location ){
    var messages = sdata.games[location].getLogMessages();
    socket.emit('server_msg',{msg: messages});
    socket.broadcast.emit('server_msg',{msg: messages});
}

/**
* получение высотных данных для юнитов и обновление соответсвующего 
* поля объектов полков в серверном объекте game 
* @param game объект Game
* @param callback функция обратного вызова, вызываемая после завершения
**/
function update_elevation(game,callback){
   elevation.updateElevation(game, function(){});            
}


/**
* обработчик события постановки игры на паузу одним из клиентов
* генерация событий game_pause_server
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**
function game_pause(socket, sdata){
    socket.on('game_pause_client',function(data){
        //console.log(data.msg+': '+JSON.stringify(data.user));
        socket.broadcast.emit('game_pause_server',{user:data.user});
        socket.emit('game_pause_server',{user:data.user});
        sdata.game.addLogMessage('game paused by user ' + data.user.name);
        sendLogMessages(socket, sdata);
    });
}

/**
* обработчик события старта игры
* генерация событий game_start_server
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**
function game_start(socket, sdata){
    socket.on('game_start_client',function(data){
        socket.broadcast.emit('game_start_server',{user:data.user});
        socket.emit('game_start_server',{user:data.user});
        sdata.game.addLogMessage('user ' + data.user.name + ' start game');
        sendLogMessages(socket, sdata);
    });
}

/**
* обработчик события выхода из игры
* обнуление объекта game, удаление объектов user
* генерация событий game_exit_server
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**
function game_exit(socket, sdata){
    socket.on('game_exit_client',function(data){
        //console.log(data.msg+': '+JSON.stringify(data.user));
        if (sdata.game == null) return;
        sdata.game.addLogMessage('game over by user ' + data.user.name);
        sendLogMessages(socket, sdata);
        sdata.game.exit(function(){
            sdata.game = null;
            sdata.clearUsers();
        });
        socket.broadcast.emit('game_exit_server');
        socket.emit('game_exit_server');   
    });
}

/**
* обработчик события запроса вариантов миссий клиентом 
* генерация событий send_missions и посылка данных о миссиях
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**
function get_missions(socket,sdata){
    socket.on('get_missions', function(data){
        if ( sdata.game == null ){
            socket.emit('send_missions',{missions:missions, isGameInit:false});
        }else{
            var mission = missions[sdata.game.mission.id];
            mission.country = getFreeCountry(sdata.game.regiments);
            socket.emit('send_missions',{missions:mission, isGameInit:true, remoteGame: sdata.game.toString() });
        }
        
    });
}

/**
* обработчик события инициализации игры клиентом
* создается и иниц. объект game, user
* генерация событий game_init_server, client_refresh_by_server
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**/
/*
function game_init_client(socket, sdata){
    socket.on('game_init_client',function(data){
        if (sdata.game != null){
            socket.emit('client_refresh_by_server');
            return;
        }
        sdata.game = new sdata.Game();
        sdata.game.setId();
        console.log('Game create id: '+sdata.game.id);
        sdata.game.joinUser(data.user);
        sdata.game.init(data.game,function(){
            sdata.addUser(data.user);
            socket.broadcast.emit('client_refresh_by_server');
            socket.emit('game_init_server',{gameId:sdata.game.id });
            sdata.game.addLogMessage('user '+data.user.name + ' init game');
            sendLogMessages(socket, sdata);
            console.log('user '+data.user.name + ' init game');
            around.init(data.game.mission.db_file, function(){
                socket.emit('around_ready');
                socket.broadcast.emit('around_ready');
            });  
        });  
    });
}

/**
* обработчик события клонирования игры присоединяющимся клиентом
* генерация событий game_clone_server, game_ready
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**
function game_clone_client(socket, sdata){
    socket.on('game_clone_client',function(data){
        if (sdata.game == null) return; 
        sdata.game.joinUser(data.user);
        sdata.game.clone(data.game,function(){
            sdata.addUser(data.user);
            socket.emit('game_clone_server',{gameId:sdata.game.id, msg:'user '+data.user.name + ' join to game'});
            sdata.game.addLogMessage('user '+data.user.name + ' join to game');
            sendLogMessages(socket, sdata);
            console.log('user '+data.user.name + ' join to game');
            if ( sdata.game.ready ){
                socket.emit('game_ready',{gameId: sdata.game.id});
                socket.broadcast.emit('game_ready',{gameId: sdata.game.id});
            }  
        });
        sendLogMessages(socket, sdata);          
    });
}

/**
* обработчик события запроса клиента на запуск проверки факта окружения
* полка и установки соответсвующего поля объектов полков в серверном
* объекте game 
* генерация события check_around_done после окончания цикла проверки
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**
function check_around(socket,sdata){
    socket.on('check_around', function(data){
        if ( sdata.game == null ){
            socket.emit('check_around_done');
            return true;
        }
        if ( data.user.id == sdata.game.users[0].id ){
            around.setAround(sdata.game, function(){
                socket.emit('check_around_done');
            });
        }
    });
}



/**
* обработчик события запроса клиента на запуск 
* получения высотных данных для юнитов и обновление соответсвующего 
* поля объектов полков в серверном объекте game 
* генерация события check_around_done после окончания цикла проверки
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**
function update_weather(socket,sdata){
    socket.on('update_weather', function(data){
         if ( sdata.game == null ){
            socket.emit('update_weather_done');
            return true;
        }
        if ( data.user.id == sdata.game.users[0].id ){
            weather.updateWeather(sdata.game, function(){
                socket.emit('update_weather_done');
            });
        }
    });
}

/**
* обработчик события connect
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user 
**
function connect(socket,sdata){
    socket.on('connect',function(data){
        socket.emit('connect',{msg:'connect!!!'});
    });
}

/**
* получение незанятой страны при присоединении к игре второго игрока
* @param regiments массив объектов regiment
* @return country_id или false 
**
function getFreeCountry(regiments){
    for ( var i = 0; i < regiments.length; i++ ){
        if ( regiments[i].userId == 0 ) return regiments[i].country;
    }
    return false;
}

/**
* получение выбранной страны в миссии
* @param regiments массив объектов regiment
* @param user объект user
* @return country_id или false
**
function getUserCountry(regiments,user){
    for ( var i = 0; i < regiments.length; i++ ){
        if ( regiments[i].userId == user.id ) return regiments[i].country;
    }
    return false;
}




/**
* отправка игровых сообщений по клиентам
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user
* @param mess строка сообщения
**
function sendGameMessages(socket, sdata ){
    if (sdata.game == null) return;
    var messages = sdata.game.getGameMessages();
    socket.emit('server_game_msg',{msg: messages});
    //socket.broadcast.emit('server_game_msg',{msg: messages});
}

/**
* обработчик события запроса игрового сообщения клиентом
* @param socket объект socket.io
* @param sdata разделяемый объект, содержащий объект game и массив объектов user
**
function get_game_message_client(socket, sdata){
    socket.on('get_game_message_client', function(data){
        sendGameMessages(socket, sdata);
    });
}

*/

exports.data_from_client = data_from_client;
exports.get_game = get_game;
exports.set_units = set_units;


//exports.game_init_client = game_init_client;
//exports.game_clone_client = game_clone_client;
//exports.game_pause = game_pause;
//exports.game_start = game_start;
//exports.game_exit = game_exit;
//exports.get_missions = get_missions;
//exports.connect = connect;
//exports.check_around = check_around;
//exports.update_elevation = update_elevation;
//exports.update_weather = update_weather;
//exports.get_game_message_client = get_game_message_client;
