var App = {};

/**
* инициализация приложения
**/
App.init = function(){
    App.interval = null; /*интервал обновления клиента и сервера*/
    App.UPDATE_INTERVAL = 1000; /*длина интервала обновления клиента и сервера в мс*/
    App.maplib = L;
    App.io = io;
    App.socket = Socket;
    App.map = Map;
    App.iface = Interface;
    App.unitTypes = UnitTypes;
    App.countries = Countries;
    App.unit = Unit;
    App.unitFactory = UnitFactory;
    App.mouse = Mouse;
    App.user = new User(Helper.getCookie('user_id'),'noname');/*клиентский объект user*/      
    App.game = new Game(App.user);/*переменная для хранения клиентского объекта game*/
    
    App.map.init(App);  
    App.socket.init(App);
    App.unitFactory.init(App);
    App.mouse.init(App);
    App.iface.init(App);
    
    App.setEventHandlers();
};

/**
* Установка обработчиков на события рассылаемые сервером
**/
App.setEventHandlers = function(){
    App.socket.setEventHandler('connect', App.connect);
    App.socket.setEventHandler('disconnect', App.disconnect);
    App.socket.setEventHandler('resume_game', App.play);
    App.socket.setEventHandler('client_refresh_by_server', App.clientRefreshByServer);
    App.socket.setEventHandler('data_from_server', App.dataFromServer);
    App.socket.setEventHandler('game_over', App.gameOver);
    App.socket.setEventHandler('takeroute', App.moveUnit);
    App.socket.setEventHandler('updategame', App.updateGame);
    App.socket.setEventHandler('unit_added', App.onAddUnit);
    App.socket.setEventHandler('unit_deleted', App.onDelUnit);
};

/**
* обработчик события connect
* генерация события get_game
**/
App.connect = function(){
    App.socket.send('get_game', {user:App.user, location:App.socket.pathname});
};

/**
* обработчик события disconnect
* перезагрузка страницы
**/
App.disconnect = function(){
    window.location.reload(true);
};

/**
* обработчик события получения игры от сервера
**/
App.play = function(data){
    if ( data.game ) {
        App.game.restore(data.game, function(){});
        App.user.gameId = data.game.id;
        App.iface.input_username.innerText = App.game.user.name;
        App.iface.input_username.textContent = App.game.user.name;
        App.iface.country_image.src=Countries[App.game.country.id].icon.url; 
        App.setMapOptions(data.game);
        App.interval = setInterval(App.sync, App.UPDATE_INTERVAL);       
   }
};

/**
* Цикл синхронизации клиента и сервера
**/
App.sync = function(){
    App.game.loop();
    App.sendDataToServer();
};


/**
* обработчик события получения данных от сервера для синхронизации
**/
App.dataFromServer = function(data){
    App.game.sync(data.game);
    App.iface.updateInfoUnit();
    App.iface.addLog( data.game.logMessages );
    App.iface.addInfo( data.game.gameMessages );
};

/**
* обработчик события от сервера о перезагрузке страницы
**/
App.clientRefreshByServer = function(data){
    window.location.reload(true);
};

/**
* обработчик события от сервера об обновлении объекта игры
**/
App.updateGame = function(data){
    //App.game.restore(data.game, function(){});
};

/**
* обработчик сообщения события окончания игры 
**/
App.gameOver = function(){
    App.iface.showAlert(App.iface.dict['game_over'], function(){ App.iface.reloadPage('/');});
};


/**
* посылка данных на сервер для синхронизации
* и генерация события game_from_client
* с посылкой данных объекта game
**/
App.sendDataToServer = function(){
    App.socket.send('data_from_client', {game: App.game.toString(), user: App.user.toString(), location:App.socket.pathname.slice(App.socket.prefix.length)});
};

/**
* позиционирование карты и установка границ
* @param game объект игры
**/
App.setMapOptions = function(game){
    var SW_lat = game.location.bounds.SW[0];
    var SW_lng = game.location.bounds.SW[1];
    var NE_lat = game.location.bounds.NE[0];
    var NE_lng = game.location.bounds.NE[1];
    var center = [(SW_lat + NE_lat)/2, (SW_lng + NE_lng)/2];
    App.map.setView(center,13);
    App.map.setBoundary(SW_lat, SW_lng, NE_lat, NE_lng);
    App.map.map.minZoom = game.location.minZoom;
    App.map.map.maxZoom = game.location.maxZoom;
};

/**
* перемещение юнита по маршруту (запрос маршрута движения у сервера)
* @param unit объект юнита
* @param latlng координаты точки назначения [lat,lng]
**/
App.unitGoRoute = function(unit, latlng){
    var start = unit.latlng;
    var end = latlng;
    App.socket.send('getroute', {id:unit.id, start:start, end:end, location:App.game.location.id});
};

/**
* функция обратного вызова, вызываемая после получения маршрута от сервера
* анимированное движение юнита на карте по маршруту
* @param data объект данных, получаемый с сервера
**/
App.moveUnit = function(data){
    var unit = App.game.getUnit(data.id);
    if (unit != null){
        Move.moveUnitRouteAnimation( unit, data.route );
    }   
};

/**
* отправка запроса на добавление юнита в игру
* @param id id юнита от имени которого отправляется запрос
* @param unitType id типа создаваемого юнита
**/
App.addUnit = function(id, unitType){
    var object = App.game.getBase(id);
    if ( object == null ) return false;
    var delta = 0.01;
    var latlng = [object.latlng[0]+delta, object.latlng[1]+delta];
    var country = App.game.country.id;
    var type = unitType;
    var userId = App.user.id;
    var unit = App.unitFactory.createUnit(latlng, type, country, 0, App.user.id);
    unit.init();
    App.socket.send('add_unit', {id:id, unit:unit.toString(), location:App.game.location.id});
    unit.destroy();
};

/**
* отправка запроса на удаление юнита из игры
* @param id идентификатор юнита, который нужно удалить
* @param parentId id юнита от имени которого отправляется запрос 
**/
App.delUnit = function(id, parentId ){
    App.socket.send('del_unit', {id:id, parent_id:parentId, location:App.game.location.id});
};

/**
* обработчик события создания юнита от сервера 
* @param data объект данных, получаемый с сервера
**/
App.onAddUnit = function(data){
    var parent_unit = App.game.getUnit(data.parent_id);
    if (parent_unit == null) return false;
    parent_unit.addChild(data.added_unit_id);
};

/**
* обработчик события удаления юнита от сервера 
* @param data объект данных, получаемый с сервера
**/
App.onDelUnit = function(data){
    var parent_unit = App.game.getUnit(data.parent_id);
    if (parent_unit == null) return false;
    parent_unit.delChild(data.deleted_unit_id);
};

