/*конструктор серверного объекта Game*/
var Helper = require('./helper');
var Battle = require('./battle');

function Game(location)
{
    this.id = Helper.getRandomInt(1000000,2000000);; /*id игры*/
    this.location = location;/*объект, описывающий локацию*/
    this.ready = true; /*флаг готовности игры*/
    this.users = {}; /*объект игроков*/ 
    this.status = ''; /*состояние игры*/
    this.regiments = []; /*массив полков*/
    this.bases = []; /*массив баз*/
    this.unitcnt = 0 /*счетчик для присвоения id юнитам*/
    this.logMessages = []; /*массив лог-сообщений*/
    this.MAX_LIVE_TIMEOUT = 15; /*максимальное время непоступления событий от пользователя*/
    this.gameMessages = []; /*массив игровых сообщений*/
    this.MAX_LOG_MESSAGES = 10; /*максимальное количество лог-сообщений*/
    this.MAX_GAME_MESSAGES = 20;/*максимальное количество игровых сообщений*/
}

    
/**
* установка флага игры
* @param ready флаг
**/
Game.prototype.setReady = function(ready){
    this.ready = ready;
}
    
    
    
/**
* получение имени user по id
* @param userId id
* @return id или undefined 
**/
Game.prototype.getUserName = function(userId){
    return (this.users[userId])? this.users[userId].name : null;
}


/**
* клонирование игры при присоединении к игре второго игрока  
* @param game объект Game принятый от клиента инициализировавшего игру
* callback функция обратного вызова, вызываемая по завершении операции
**/
Game.prototype.clone = function(game,callback){
    for ( var i = 0; i < this.regiments.length; i++ ){
        if ( this.regiments[i].userId == 0 && this.regiments[i].id == game.regiments[i].id ){
            this.regiments[i].userId = game.regiments[i].userId;
        }
    }
    for ( var i = 0; i < this.bases.length; i++ ){
        if ( this.bases[i].userId == 0 && this.bases[i].id == game.bases[i].id ){
            this.bases[i].userId = game.bases[i].userId;
        }
    }
    
    for ( var i = 0; i < this.users.length; i++ ){
        this.users[i].gameId = this.id;
    }
    
    callback();
};

/**постановка игры на паузу
* @param user объект user от клиента
**/
Game.prototype.pause = function(user){
    this.setReady(false);  
};

/**старт игры
* @param user объект user от клиента
**/
Game.prototype.start = function(user){
    this.setReady(true);
}


/**
* синхронизировать ли заданный параметр юнита в серверном объекте game
* с объектом game с клиента
* @param param строка с названием параметра
* @return true/false
**/
Game.prototype.isSyncParamFromClient = function(param){
    var syncParams = ['latlng', 'status', 'country'];
    return ( syncParams.indexOf(param) != -1 )? true : false;
};

/**
* синхронизация серверного объекта Game с клиентским 
* @param game объект Game принятый от клиента для синхронизации
**/
Game.prototype.sync = function(game){
    if ( !this.ready ) return false;
    
    /*уничтожение отсутсвующих в клиентском объекте полков*/
    var i = 0;
    while( i < this.regiments.length ){
        var unitPresent = false;
        for ( var j = 0; j < game.regiments.length; j++ ){
            if ( this.regiments[i].id == game.regiments[j].id ) unitPresent = true;
        }
        if ( !unitPresent ){
            this.addGameMessage(this.gameMsgText('unitKilled',this.regiments[i]));
            delete this.regiments[i];
            this.regiments.splice(i,1);
        }else{
            i++;
        }
    }
    
    /*уничтожение отсутсвующих в клиентском объекте баз*/
    var i = 0;
    while( i < this.bases.length ){
        var unitPresent = false;
        for ( var j = 0; j < game.bases.length; j++ ){
            if ( this.bases[i].id == game.bases[j].id ) unitPresent = true;
        }
        if ( !unitPresent ){
            this.addGameMessage(this.gameMsgText('unitKilled',this.bases[i]));
            delete this.bases[i];
            this.bases.splice(i,1);
        }else{
            i++;
        }
    }
    
    /*синхронизация полков*/ 
    for ( var i = 0; i < this.regiments.length; i++ ){
        var correct = ( 
            this.regiments[i].id == game.regiments[i].id &&
            game.regiments[i].OWN == true &&
            this.regiments[i].userId == game.user.id
        );
        if ( correct ){
            for ( param in game.regiments[i] ){
                if ( this.isSyncParamFromClient(param) ){
                    this.regiments[i][param] = game.regiments[i][param];
                }
            }
        }
    }
    /*синхронизация  баз*/
    for ( var i = 0; i < this.bases.length; i++ ){
        var correct = ( 
            this.bases[i].id == game.bases[i].id &&
            game.bases[i].OWN == true &&
            this.bases[i].userId == game.user.id
        );
        if ( correct ){
            for ( param in game.bases[i] ){
                if ( this.isSyncParamFromClient(param) ){
                    this.bases[i][param] = game.bases[i][param];
                }       
            }
        }
    }
};

Game.prototype.battleLoop = function(){
    Battle.perform(this);  
};

/**
* обновление времени последнего поступления событий от клиента игрока 
* @param user объект user от клиента
**/
Game.prototype.updateUserTime = function (user){
    if ( this.users[user.id] ){
       var now = new Date();
        //console.log('name='+this.users[i].name+'; last='+this.users[i].lastTime+'; now='+now.getTime()+ '; deltatime='+(now.getTime()-this.users[i].lastTime));
        this.users[user.id].lastTime = now.getTime();
    }
};

/**
* проверка что время от последнего поступления от клиента игроков 
* сигнала об активности не превышает заданного порога
* @param user объект user
* @return true если время не превышает порога или false в противном случае  
**/
Game.prototype.isUserLive = function(user){
    var now = new Date();
    var nowTime = now.getTime();
    if (!this.users[user.id]) return false;
    if ( (( nowTime - this.users[user.id].lastTime ) > this.MAX_LIVE_TIMEOUT) && (( nowTime - this.users[user.id].lastTime ) < this.MAX_LIVE_TIMEOUT * 10) ) return false;
    return true;
};

/**
* преобразование объекта в вид который может быть преобразован в строку
* @return game преобразованный объект 
**/
Game.prototype.toString = function(){
    var game = {};
    game.id = this.id;
    game.ready = this.ready;
    game.users = this.users; 
    game.status = this.status;
    game.regiments = this.regiments;
    game.bases = this.bases;
    game.location = this.location;
    game.gameMessages = this.gameMessages;
    game.logMessages = this.logMessages;
    return game;
};

/**
* Возвращает объект полка по его id
**/
Game.prototype.getRegiment = function(id){
    for ( var i = 0; i < this.regiments.length; i++ ){
        if ( this.regiments[i].id == id ) return this.regiments[i];
    }
    return null;  
};

/**
* Возвращает объект базы по его id
**/
Game.prototype.getBase = function(id){
    for ( var i = 0; i < this.bases.length; i++ ){
        if ( this.bases[i].id == id ) return this.bases[i];
    }
    return null;  
};

/**
* добавление лог-сообщения
* @param mess строка сообщения
**/
Game.prototype.addLogMessage = function(mess){
    this.logMessages.unshift(mess);
    if ( this.logMessages.length > this.MAX_LOG_MESSAGES ){
        this.logMessages.pop();
    }  
};

/**
* добавление игрового сообщения
* @param mess строка сообщения
**/
Game.prototype.addGameMessage = function(mess){
    var len = this.gameMessages.length;
    this.gameMessages.unshift(mess);
    if ( this.gameMessages.length > this.MAX_GAME_MESSAGES ){
        this.gameMessages.pop();
    }
    return true;
};

/**
* возвращает лог-сообщения
* @return массив строк сообщений
**/
Game.prototype.getLogMessages = function(){
    return this.logMessages;   
};

/**
* возвращает игровые сообщения
* @return массив строк сообщений
**/
Game.prototype.getGameMessages = function(){
    return this.gameMessages;   
};

/**
* проверка окончания игры
* если у ккакого-то игрока нет ни одного юнита игра закончена
* @return true/false закончена/не закончена
**/
Game.prototype.checkGameOver = function(userId){
    if (!this.users[userId]) return false;
    var gameOver = false;
        var unitCount = 0;
        for ( var j = 0; j < this.regiments.length; j++ ){
            if ( this.regiments[j].userId == userId ) unitCount++;
        }
        
        for ( var j = 0; j < this.bases.length; j++ ){
            if ( this.bases[j].userId == userId ) unitCount++;
        }
        if ( unitCount == 0 ){
            delete this.users[userId];
            gameOver = true;
        } 
    return gameOver;
};

/**
* возвращает текст игрового сообщения
* @param msgId идентификатор сообщения
* @param object объект юнита посылающий сообщение
**/
Game.prototype.gameMsgText = function(msgId, object){
    var messages = {
        beginBattle: object.type.name + ' ' + object.id + ' ' +object.country.name + ' вступил в бой',
        endBattle: object.type.name + ' ' + object.id + ' ' +object.country.name + ' вышел из боя',
        beginAround: object.type.name + ' ' + object.id + ' ' +object.country.name + ' снабжение прервано',
        endAround: object.type.name + ' ' + object.id + ' ' +object.country.name + ' снабжение восстановлено',
        unitKilled: object.type.name + ' ' + object.id + ' ' +object.country.name + ' уничтожен',
        baseCaptured: object.type.name + ' ' + object.id + ' ' +object.country.name + ' захвачена противником'
    };
    
    return messages[msgId];
};

    

/**
* присоединение игрока к игре
* @param user объект User
**/
Game.prototype.joinUser = function(units, user, callback){
    this.users[user.id] = user;
    for ( var i = 0; i < units.regiments.length; i++ ){
        units.regiments[i].iserId = user.id;
        units.regiments[i].id = this.unitcnt++;
        this.regiments.push(units.regiments[i]);
    }
    
    for ( var i = 0; i < units.bases.length; i++ ){
        units.bases[i].iserId = user.id;
        units.bases[i].id = this.unitcnt++;
        this.bases.push(units.bases[i]);
    }
    callback();
    
};

exports.Game = Game;