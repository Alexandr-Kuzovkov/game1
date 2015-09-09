/**
* конструктор клиентского объекта игры Game
* @param user клиентский объект user
**/
function Game( user )
{
	this.id = 0; /*идентификатор*/
    this.user = user; /*поле для хранения объекта user*/
    this.users = {}; /*объект для хранения объектов пользователей игры*/
    this.country = null; /*выбранная страна за которую играет игрок*/
    this.location = null;
	this.regiments = []; /**массив полков*/
	this.bases = [];     /*массив баз*/
    this.start = false;  /*флаг состояния игры*/
    this.gameEventQueue = [];/*очередь игровых событий*/
    
    /*запуск инициализации объектов полков*/
    this.initRegiments = function(){
		for ( var i = 0; i < this.regiments.length; i++ ) this.regiments[i].init();
	};
	
    /*запуск инициализации объектов баз*/
	this.initBases = function(){
		for ( var i = 0; i < this.bases.length; i++ ) this.bases[i].init();
	};
	
     /*установка всех полков и баз в состояние unselect*/
	this.unselectAll = function(){
		for ( var i = 0; i < this.regiments.length; i++ ) this.regiments[i].unselect();
		for ( var i = 0; i < this.regiments.length; i++ ) this.bases[i].unselect();
	};
	
    /*установка всех полков в состояние unselect*/
	this.unselectRegiments = function(){
		for ( var i = 0; i < this.regiments.length; i++ ) this.regiments[i].unselect();
	};
	
    /*установка всех полков и баз противника в состояние unselect*/
    this.unselectNotOwn = function(){
		for ( var i = 0; i < this.regiments.length; i++ ) if ( !this.regiments[i].OWN ) this.regiments[i].unselect();
        for ( var i = 0; i < this.bases.length; i++ ) if ( !this.bases[i].OWN ) this.bases[i].unselect();
    };
    
    /*установка всех баз в состояние unselect*/
	this.unselectBases = function(){
		for ( var i = 0; i < this.bases.length; i++ ) this.bases[i].unselect();
	};
    
    /*вызов методов обновления юнитов игры*/
    this.updateUnits = function(){
        for ( var i = 0; i < this.regiments.length; i++ ){
            this.regiments[i].update();
        }
        for ( var i = 0; i < this.bases.length; i++ ){
            this.bases[i].update();
        }  
    };
    
	
    /**
    * создание полка
    * @param latlng координаты [lat,lng]
    * @param country строковый идентификатор страны
    * @param type строка указывающая тип объекта
    * @param id идентификатор юнита
    * @param userId id пользователя 
    **/
	this.createRegiment = function( latlng, country, type, id, userId ){
		var regiment = App.unitFactory.createUnit( latlng, type, country, id, userId ); 
        regiment.OWN = ( this.user.id == regiment.userId )? true:false;
        if ( this.user.id != regiment.userId ) regiment.userId = 0;
        regiment.init();
        this.regiments.push(regiment);
		delete regiment;
	};
	
    /**
    * создание базы снабжения
    * @param latlng координаты [lat,lng]
    * @param country строковый идентификатор страны
    * @param type строка указывающая тип объекта
    * @param id идентификатор юнита
    * @param userId id пользователя
    **/
	this.createSupplyBase = function( latlng, country, type, id, userId ){
		var base = App.unitFactory.createUnit( latlng, type, country, id, userId ); 
        base.OWN = ( this.user.id == base.userId )? true:false;
        if ( this.user.id != base.userId ) base.userId = 0;
        base.init();
		this.bases.push(base);
		delete base;
	};
    
    /**
    * Возвращает объект полка по его id
    **/
    this.getRegiment = function(id){
        for ( var i = 0; i < this.regiments.length; i++ ){
            if ( this.regiments[i].id == id ) return this.regiments[i];
        }
        return null;  
    };
    
    /**
    * Возвращает объект базы по его id
    **/
    this.getBase = function(id){
        for ( var i = 0; i < this.bases.length; i++ ){
            if ( this.bases[i].id == id ) return this.bases[i];
        }
        return null;  
    };
    
    /**
    * Возвращает объект юнита по его id
    **/
    this.getUnit = function(id){
        for ( var i = 0; i < this.bases.length; i++ ){
            if ( this.bases[i].id == id ) return this.bases[i];
        }
        for ( var i = 0; i < this.regiments.length; i++ ){
            if ( this.regiments[i].id == id ) return this.regiments[i];
        }
        return null;  
    };
    
    
	
    /**
    * уничтожение юнита
    * @param id юнита
    **/
	this.deleteUnit = function(id){
		for ( var i = 0; i < this.regiments.length; i++ ) {
            if ( this.regiments[i].id == id ){
    			var unit = this.regiments[i];
                delete this.regiments[i];
                this.regiments.splice(i,1);
                unit.destroy();
                return;
    		}
        }
        
        for ( var i = 0; i < this.bases.length; i++ ) {
            if ( this.bases[i].id == id ){
    			var unit = this.bases[i];
                delete this.bases[i];
    			this.bases.splice(i,1);
                unit.destroy();              
    		}
        }  
	};
	
    /**
    * установка страны за которую выбрал играть игрок
    * @param country объект страны
    **/
    this.selectCountry = function(country){
        this.country = country;
    };
    
    /**
    * игровой цикл в котором происходит обновление юнитов игры
    **/
	this.loop = function(){
        for ( var i = 0, len = this.regiments.length; i < len; i++ ) this.regiments[i].update();
		for ( var i = 0, len = this.bases.length; i < len; i++ ) this.bases[i].update();
        this.handlingGameEvents();
        
    };
    
    /**
    * востановление клиентского объекта игры из принятого серверного объекта игры
    * @param remoteGame принятый серверный объект игры
    * @param callback функция обратного вызова, вызываемая по завершении операции
    **/
    this.restore = function(remoteGame,callback){
        //console.log(JSON.stringify(remoteGame));
        this.destroyAll();
        var regiments = remoteGame.regiments;
        var bases = remoteGame.bases;
        for ( var i =0; i < regiments.length; i++ ) 
            this.createRegiment( regiments[i].latlng, regiments[i].country.id, regiments[i].type.id, regiments[i].id, regiments[i].userId ); 
        for ( var i =0; i < bases.length; i++ ) 
            this.createSupplyBase( bases[i].latlng, bases[i].country.id, bases[i].type.id, bases[i].id, bases[i].userId ); 
        this.id = remoteGame.id;
        this.location = remoteGame.location;
        this.users = remoteGame.users;
        for (key in this.users){
            if (this.users[key].id == this.user.id) this.user.name = this.users[key].name;
        }
        for (var i = 0; i < this.regiments.length; i++){
            if (this.regiments[i].userId == this.user.id){
                this.country = this.regiments[i].country;
                break;
            }
        }
        for (var i = 0; i < this.bases.length; i++){
            if (this.bases[i].userId == this.user.id){
                this.country = this.bases[i].country;
                break;
            }
        }
        callback();
    };
    
    /**
    * уничтожение клиентского объекта игры
    * @param callback функция обратного вызова, вызываемая по завершении операции
    **/
    this.destroy = function(callback){
        clearInterval(this.interval);
        this.start = false;
        Move.ENABLED = false;
        this.destroyAll();
        callback();
    };
    
    /**
    * уничтожение объектов полков и баз
    **/
    this.destroyAll = function(){
        while( this.regiments.length != 0 ){
            this.regiments[0].destroy();
            delete this.regiments[0];
            this.regiments.splice(0,1);
        }
        
        while( this.bases.length != 0 ){
            this.bases[0].destroy();
            delete this.bases[0];
            this.bases.splice(0,1);
        }
    };
    
    /**
    * преобразование объекта в вид который может быть преобразован в строку
    **/
    this.toString = function(){
        var game = {};
        game.id = this.id;
        game.user = this.user.toString();
        game.regimentId = this.regimentId;
    	game.baseId = this.baseId;  
        game.start = this.start;
        game.regiments = [];
    	game.bases = [];
        game.mission = this.mission;
        for ( var i = 0; i < this.regiments.length; i++ ) game.regiments.push(this.regiments[i].toString()); 
        for ( var i = 0; i < this.bases.length; i++ ) game.bases.push(this.bases[i].toString());
        return game;
    };
    
    /**
    * синхронизировать ли заданный параметр юнита в клиентском объекте game
    * с объектом game с сервера
    * @param param строка с названием параметра
    * @return true/false
    **/
    this.isSyncParamFromServer = function(param){
        var syncParams = ['elevation', 'battle', 'weather', 'died' ];
        return ( syncParams.indexOf(param) != -1 )? true : false;
    };
    
    /**
    * синхронизация объекта игры с серверным объектом игры
    * @param game серверный объект игры
    **/
    this.sync = function(game){
        var exists = false;
        var actualGame = ( this.id == game.id );
        console.log(game.regiments.length);
        if ( actualGame ){
            /*уничтожение полков которых нет в серверном объекте игры*/
            for (var i = 0; i < this.regiments.length; i++){
                exists = false;
                for (var j = 0; j < game.regiments.length; j++){
                    if ( this.regiments[i].id == game.regiments[j].id ) {
                        exists = true;
                        break;
                    }
                }
                if ( !exists ){
                    this.deleteUnit(this.regiments[i].id);
                }
            }
            
            /*уничтожение баз которых нет в серверном объекте игры*/
            for (var i = 0; i < this.bases.length; i++){
                exists = false;
                for (var j = 0; j < game.bases.length; j++){
                    if ( this.bases[i].id == game.bases[j].id ) {
                        exists = true;
                        break;
                    }
                }
                if ( !exists ){
                    this.deleteUnit(this.bases[i].id);
                }
            }
            
            /*добавление полков которых нет в клиентском объекте игры*/
            
            for (var i = 0; i < game.regiments.length; i++ ){
                exists = false;
                for ( var j = 0; j < this.regiments.length; j++ ){
                    if ( game.regiments[i].id == this.regiments[j].id ){
                        exists = true;
                        break;
                    }  
                }
                if ( !exists ){
                    var latlng = game.regiments[i].latlng;
                    var country = game.regiments[i].country.id;
                    var type = game.regiments[i].type.id;
                    var id = game.regiments[i].id;
                    var userId = game.regiments[i].userId;
                    this.createRegiment(latlng, country, type, id, userId);
                }
            }
            
            /*добавление баз которых нет в клиентском объекте игры*/
            for (var i = 0; i < game.bases.length; i++ ){
                exists = false;
                for ( var j = 0; j < this.bases.length; j++ ){
                    if ( game.bases[i].id == this.bases[j].id ){
                        exists = true;
                        break;
                    }  
                }
                if ( !exists ){
                    var latlng = game.bases[i].latlng;
                    var country = game.bases[i].country.id;
                    var type = game.bases[i].type.id;
                    var id = game.bases[i].id;
                    var userId = game.bases[i].userId;
                    this.createSupplyBase(latlng, country, type, id, userId);
                }
            }
                        
            /*движение полков противника*/
            for ( var i = 0; i < this.regiments.length; i++ ){
                if (game.regiments[i] == undefined) continue;
                var foreignAndCorrect = ( game.regiments[i].userId != this.user.id &&
                    game.regiments[i].id == this.regiments[i].id );
                if ( foreignAndCorrect ) {
                    this.regiments[i].replace( game.regiments[i].latlng );
                } 
            }
            
            /*движение баз противника*/
            for ( var i = 0; i < this.bases.length; i++ ){
                 if (game.bases[i] == undefined) continue;
                var foreignAndCorrect = ( game.bases[i].userId != this.user.id &&
                    game.bases[i].id == this.bases[i].id );
                if ( foreignAndCorrect ){
                    this.bases[i].replace( game.bases[i].latlng );
                }
            }
            
            /*синхронизация  полков*/
            for ( var i = 0; i < this.regiments.length; i++ ){
                if (game.regiments[i] == undefined) continue;
                var corresponding = this.regiments[i].id == game.regiments[i].id;
                if (corresponding){
                    
                    this.regiments[i].lastelevation = this.regiments[i].elevation;
                    for ( param in game.regiments[i] ){
                        if ( this.isSyncParamFromServer(param) ){
                            this.regiments[i][param] = game.regiments[i][param];
                        }
                    }
                    this.regiments[i].type.resources = game.regiments[i].type.resources;  
                } 
            }
            
            /*синхронизация  баз*/
            for ( var i = 0; i < this.bases.length; i++ ){
                if (game.bases[i] == undefined) continue;
                var corresponding = this.bases[i].id == game.bases[i].id;
                if (corresponding){
                    this.bases[i].lastelevation = this.bases[i].elevation;
                    for ( param in game.bases[i] ){
                        if ( this.isSyncParamFromServer(param) ){
                            this.bases[i][param] = game.bases[i][param];
                        }
                    } 
                    this.bases[i].type.resources = game.bases[i].type.resources; 
                } 
            }
            
            
        }//end if actualGame
        
    };
    
    /**
    * добавление события в очередь игровых событий
    * @param eventName имя события
    * @param eventData объект данных, передаваемый обработчику
    * @param priority приоритет события
    **/
    this.addGameEvent = function(eventName, eventData, priority){
        this.gameEventQueue.push({eventName:eventName, eventData:eventData, priority:priority});
    };
    
    /*определени обработчиков игровых событий*/
    this.gameEventHandlers = {
        
    };
    
    /*обработка игровых событий*/
    this.handlingGameEvents = function(){
        var i = 0;
        while(i < this.gameEventQueue.length){
            this.gameEventQueue[i].priority--;
            if (this.gameEventQueue[i].priority <= 0){
                this.gameEventHandlers[this.gameEventQueue[i].eventName](this.gameEventQueue[i].eventData);
                delete this.gameEventQueue[i];
                this.gameEventQueue.splice(i,1);
            }else{
                i++;
            }
        } 
    };
       
}//end Game