var App = {};

App.init = function(){
    App.maplib = L;
    App.io = io;
    App.socket = Socket;
    App.map = Map;
    App.iface = Interface;
    App.unitTypes = UnitTypes;
    App.countries = Countries;
    App.unit = Unit;
    App.unitEvent = UnitEvent;
    App.unitFactory = UnitFactory;
    App.user = new User(Helper.getCookie('user_id'),'noname');/*клиентский объект user*/      
    App.game = new Game(App.user);/*переменная для хранения клиентского объекта game*/
    
    App.map.init(App);  
    App.socket.init(App);
    App.unitFactory.init(App);
    App.unitEvent.init(App);
    App.iface.init(App);
    App.setEventHandlers();
    
};

App.units = {regiments: [], bases: [], country: null}; /*установленные юниты*/
App.unitObject = []; //массив объектов юнитов
App.location = null;
App.location_units = {};
App.currentType = null;

/**
* Установка обработчиков на события рассылаемые сервером
**/
App.setEventHandlers = function(){
    App.socket.setEventHandler('connect', App.connect);
    App.socket.setEventHandler('disconnect', App.disconnect);
    App.socket.setEventHandler('new_game', App.join);
    App.socket.setEventHandler('client_refresh_by_server', App.clientRefreshByServer);
    App.socket.setEventHandler('data_from_server', App.dataFromServer);
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
        App.game.startGame();
   } 
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


/*показ меню установки юниов на карту*/
App.showUnitMenu = function(){
    var type = null;
    for (key in App.location.units){
        if ( type == null ) type = key;
    }
    App.updateUnitList(type);
    App.map.addEventListener('click',App.makeUnit);   
};

/*обновление списка юнитов*/
App.updateUnitList = function(type){
    App.iface.destroyChildren(App.iface.selectCountry);//очищаем список стран
    App.iface.destroyChildren(App.iface.unitsList);//очищаем список юнитов
    var presentCountries = App.getPresentCountries();
    //формируем список стран
    for (var i = 0; i < App.location.countries.length; i++){
        if ( presentCountries[App.location.countries[i]] !== undefined ) continue;//удаляем из списка страну которая уже выбрана
        var opt = document.createElement('option');
        opt.value = App.location.countries[i];
       
        opt.innerText = Countries[App.location.countries[i]].name;
        opt.textContent = Countries[App.location.countries[i]].name;
        App.iface.selectCountry.appendChild(opt);
    }
    //формируем список юнитов  
    var checked = false;
    for ( var key in App.location.units ){
        if (App.allUnitsLocated()){ //если все юниты кончились показываем это
            var p = document.createElement('p');
            p.innerText = 'Нет доступных юнитов';
            p.textContent = 'Нет доступных юнитов';
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
        span.innerText = UnitTypes.names[key]+' - ';
        span.textContent = UnitTypes.names[key]+' - ';
        li.appendChild(span);
        
        var count = document.createElement('span');
        count.innerText = App.location.units[key];
        count.textContent = App.location.units[key];
        count.className ='units-avail';
        li.appendChild(count);
        App.iface.unitsList.appendChild(li);
    }   
};

/*получаем выбранный вариант юнита*/
App.getRadio = function(){
    var inputs = document.getElementsByTagName('input');
    for ( var i = 0; i < inputs.length; i++ ){
        if ( inputs[i].attributes.name.value == 'type' )
            if ( inputs[i].attributes.type.value == 'radio' )
                if( inputs[i].checked ) return inputs[i].value;
    }
    return null;
};

/*все ли юниты установлены*/
App.allUnitsLocated = function(){
    var result = true;
    for (key in App.location.units){
        if ( App.location.units[key] > 0 ) result = false;
    }
    return result;
};

/*ставим юнита на карту*/
App.makeUnit = function(e){
    var type = App.getRadio();
    var country = App.iface.selectCountry.value;
    var iconCountry = Countries[country].icon;
    var typeObject = UnitTypes.getType(type);
    var iconType = typeObject.icon;
    var latlng = [e.latlng.lat, e.latlng.lng];
    console.log(latlng);
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

/*очищаем данные по редактируемой миссии*/
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

/*посылаем данные по юнитам на сервер*/
App.begin = function(){
    //console.log(JSON.stringify(App.units));
    if (!App.allUnitsLocated()){
        alert('Нужно расставить всех юнитов');
        return;
    }
       
    App.socket.send('set_units', {units:App.units, location:App.game.location.id, user:App.user.toString()});
    
};

/*получаем страны которые уже есть*/
App.getPresentCountries = function(){
    var countriesId = {};
    for (var i = 0, len = App.game.regiments.length; i < len; i++){
        countriesId[App.game.regiments[i].country.id] = 1;
    }
    return countriesId;
};