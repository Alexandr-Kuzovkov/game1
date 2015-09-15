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
    App.mouse = Mouse;
    App.unitFactory = UnitFactory;
    App.user = new User(Helper.getCookie('user_id'),'noname');/*клиентский объект user*/      
    App.game = new Game(App.user);/*переменная для хранения клиентского объекта game*/
    
    App.map.init(App);  
    App.socket.init(App);
    App.unitFactory.init(App);
    App.mouse.init(App);
    App.iface.init(App);
    App.setEventHandlers();
    
};

App.units = {regiments: [], bases: [], country: null}; /*установленные юниты*/
App.unitObject = []; //массив объектов юнитов
App.location = null; /*объект описывающий локацию*/
App.location_units = {};/*объект хранящий начальное количество юнитов в локации*/

/**
* Установка обработчиков на события рассылаемые сервером
**/
App.setEventHandlers = function(){
    App.socket.setEventHandler('connect', App.connect);
    App.socket.setEventHandler('disconnect', App.disconnect);
    App.socket.setEventHandler('new_game', App.join);
    App.socket.setEventHandler('client_refresh_by_server', App.clientRefreshByServer);
    App.socket.setEventHandler('data_from_server', App.dataFromServer);
    App.socket.setEventHandler('takenearestnode', App.makeUnit);
    App.socket.setEventHandler('updategame', App.updateGame);
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
* присоединение к игре
**/
App.join = function(data){
    if ( data.game ) {
        App.game.restore(data.game, function(){});
        App.user.gameId = data.game.id;
        App.setMapOptions(App.game);
        App.location = data.location;
        for(key in App.location.units){ //сохраняем тип и количество доступных юнитов 
            App.location_units[key] = App.location.units[key];
        }
        App.showUnitMenu();
        App.interval = setInterval(App.sync, App.UPDATE_INTERVAL);
   } 
};

/**
* обработчик события от сервера об обновлении объекта игры
**/
App.updateGame = function(data){
    App.game.restore(data.game, function(){
        App.clear();
    });
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
* посылка данных на сервер для синхронизации
* и генерация события game_from_client
* с посылкой данных объекта game
**/
App.sendDataToServer = function(){
    App.socket.send('data_from_client', {game: App.game.toString(), user: App.user.toString(), location:App.socket.pathname.slice(App.socket.prefix.length)});
}

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
}


/** 
* показ меню установки юнитов на карту
**/
App.showUnitMenu = function(){
    var type = null;
    for (key in App.location.units){
        if ( type == null ) type = key;
    }
    App.updateUnitList(type);
    App.map.addEventListener('click',App.touchMap);   
};

/**
* обновление списка юнитов
* @param type тип юнита, радиокнопка которого будет выбрана 
**/
App.updateUnitList = function(type){
    App.iface.destroyChildren(App.iface.selectCountry);//очищаем список стран
    App.iface.destroyChildren(App.iface.unitsList);//очищаем список юнитов
    var presentCountries = App.getPresentCountries();
    var listCountryIsEmpty = true;
    //формируем список стран
    for (var i = 0; i < App.location.countries.length; i++){
        if ( presentCountries[App.location.countries[i]] !== undefined ) continue;//удаляем из списка страну которая уже выбрана
        listCountryIsEmpty = false;
        var opt = document.createElement('option');
        opt.value = App.location.countries[i];
       
        opt.innerText = App.iface.dict[Countries[App.location.countries[i]].name];
        opt.textContent = App.iface.dict[Countries[App.location.countries[i]].name];
        App.iface.selectCountry.appendChild(opt);
    }
    
    if (listCountryIsEmpty){ //если список стран пуст, выводим сообщение и перекидываем на выбор локаций
        App.iface.showAlert(App.iface.dict['all_countries_bisy'], function(){ App.iface.reloadPage('/');});    
        return;
    }
    
    //формируем список юнитов  
    var checked = false;
    for ( var key in App.location.units ){
        if (App.allUnitsLocated()){ //если все юниты кончились показываем это
            var p = document.createElement('p');
            p.innerText = App.iface.dict['no_avail_unit'];
            p.textContent = App.iface.dict['no_avail_unit'];
            App.iface.unitsList.appendChild(p);
            return;
        }
        if ( App.location.units[key] <= 0 ) continue; //если юниты кончились не показываем
        var li = document.createElement('li');
        var input = document.createElement('input');
        input.type = 'radio';
        input.value = key;
        input.name = 'type';
        if (!checked){
            input.checked = true;
            checked = true;
        } 
        if ( key == type ){
            checked = true;
            input.checked = true;
        } 
        li.appendChild(input);
        
        var img = document.createElement('img');
        img.src = '/img/type/'+key+'24.png';
        li.appendChild(img);
        var span = document.createElement('span');
        span.innerText = App.iface.dict[UnitTypes.names[key]]+' - ';
        span.textContent = App.iface.dict[UnitTypes.names[key]]+' - ';
        li.appendChild(span);
        
        var count = document.createElement('span');
        count.innerText = App.location.units[key];
        count.textContent = App.location.units[key];
        count.className ='units-avail';
        li.appendChild(count);
        App.iface.unitsList.appendChild(li);
    }   
};

/**
* получаем выбранный вариант юнита
* @return строка задающая id типа юнита
**/
App.getRadio = function(){
    var inputs = document.getElementsByTagName('input');
    for ( var i = 0; i < inputs.length; i++ ){
        if ( inputs[i].attributes.name && inputs[i].attributes.name.value == 'type' )
            if ( inputs[i].attributes.type.value == 'radio' )
                if( inputs[i].checked ) return inputs[i].value;
    }
    return null;
};

/**
* все ли юниты установлены
* @return true/false 
**/
App.allUnitsLocated = function(){
    var result = true;
    for (key in App.location.units){
        if ( App.location.units[key] > 0 ) result = false;
    }
    return result;
};

/**
* обрабатываем клик на карте для установки юнита
* @param e объект события клика на карте
**/
App.touchMap = function(e){
    var dot = [e.latlng.lat, e.latlng.lng];
    App.iface.showPreloader();
    App.socket.send('getnearestnode', {latlng:dot, location: App.location.id});
};

/**
* создаем юнита в заданной точке карты
* @param data объект возвращаемый сервером
**/
App.makeUnit = function(data){
    App.iface.hidePreloader();
    var latlng = data.latlng;
    if (App.isPlaceBusy(latlng)){
        App.iface.showAlert(App.iface.dict['bad_pos']);
        return;
    }
    var type = App.getRadio();
    var country = App.iface.selectCountry.value;
    var iconCountry = Countries[country].icon;
    var typeObject = UnitTypes.getType(type);
    var iconType = typeObject.icon;
    var unit = null;  
    var unit = App.unitFactory.createUnit(latlng, type, country, 0, App.user.id);
    unit.init();
    if ( unit.type.id == 'base'){
        App.units.bases.push(unit.toString());
    }else{
        App.units.regiments.push(unit.toString());
    }
    App.unitObject.push(unit);
    App.units.country = Countries[App.iface.selectCountry.value].toString();
    App.iface.selectCountry.disabled = 'disabled';
    App.location.units[type] -= 1;
    App.updateUnitList(type); 
};

/**
* очищаем данные по редактируемой миссии
**/
App.clear = function(){
    for ( var key in App.units ){
        App.units[key] = [];
    }
    for (var i = 0; i < App.unitObject.length; i++){
         App.unitObject[i].destroy();
    }
    App.iface.selectCountry.removeAttribute('disabled');
    App.location.units = App.location_units;
    App.updateUnitList(); 
};

/**
* посылаем данные по юнитам на сервер
**/
App.begin = function(){
    if (!App.allUnitsLocated()){
        App.iface.showAlert(App.iface.dict['need_place_all']);
        return;
    }
    var now = new Date();
    App.user.lastTime = now.getTime();   
    if (App.iface.input_username.value == ''){
        App.iface.showAlert(App.iface.dict['enter_name']);
        return;
    }
    
    if (!App.isUserNameFree(App.iface.input_username.value)){
        App.iface.showAlert(App.iface.dict['name_bisy']);
        return;
    }
    
    App.user.name = App.iface.input_username.value;
    App.socket.send('join_user', {units:App.units, location:App.game.location.id, user:App.user.toString()});    
};

/**
* получаем id стран которые уже есть
* @return объект вида {country1_Id: 1, country2_Id: 1}
**/
App.getPresentCountries = function(){
    var countriesId = {};
    for (var i = 0, len = App.game.regiments.length; i < len; i++){
        countriesId[App.game.regiments[i].country.id] = 1;
    }
    for (var i = 0, len = App.game.bases.length; i < len; i++){
        countriesId[App.game.bases[i].country.id] = 1;
    }
    return countriesId;
};

/**
* занято ли место куда ставим юнита другим юнитом
* @param latlng массив координат места [lat,lng]
* @return true/false занято/незанято
**/
App.isPlaceBusy = function(latlng){
    for (var i = 0, len = App.game.regiments.length; i < len; i++){
        if ( Helper.rastGrad(latlng, App.game.regiments[i].latlng) <= App.game.regiments[i].type.radius*2) return true;
    }
    for (var i = 0, len = App.game.bases.length; i < len; i++){
        if ( Helper.rastGrad(latlng, App.game.bases[i].latlng) <= App.game.bases[i].type.radius*2) return true;
    }
    for (var i = 0, len = App.unitObject.length; i < len; i++){
        if ( Helper.rastGrad(latlng, App.unitObject[i].latlng) <= App.unitObject[i].type.radius*2) return true;
    }
    return false;
};

/**
* проверка есть ли уже такое имя пользователя
* @param username Имя пользователя
* @return true если имя не занято, иначе false
**/
App.isUserNameFree = function(username){
    for (key in App.game.users){
        if ( App.game.users[key].name == username ) return false;
    }
    return true;
};
