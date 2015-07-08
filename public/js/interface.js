/**
* объект пользовательского интерфейса
**/
var Interface = {};


Interface.init = function(app) {
    Interface.wrap_start_div = document.getElementById('wrap-start');
    Interface.map_div = document.getElementById('map');
    Interface.mission_select = null;
    Interface.country_select = null;
    Interface.parent_mission_select = document.getElementById('td-mission');
    Interface.parent_country_select = document.getElementById('td-country');
    Interface.button_start = document.getElementById('btn-start');
    Interface.input_name = document.getElementById('input-name');
    Interface.error_div = document.getElementById('error-block');
    Interface.button_exit = document.getElementById('btn-exit');
    Interface.button_pause = document.getElementById('btn-pause');
    Interface.log_div = document.getElementById('log-message');
    Interface.info_div = document.getElementById('info-message');
    Interface.unitinfo_div = document.getElementById('unit-info');
    Interface.weatherinfo_div = document.getElementById('weather-info');
    Interface.gameover_div = document.getElementById('game-over');
    Interface.label_next = document.getElementById('label-next');
    Interface.preloader = document.getElementById('preloader');
    Interface.label_mission = document.getElementById('mission-label');
    Interface.missioninfo_div = document.getElementById('mission-info');
    Interface.missiondesc_p = document.getElementById('mission-desc');
    Interface.button_menu = document.getElementById('btn-menu');
    Interface.button_clear_all = document.getElementById('btn-clear-all');
    Interface.button_begin_game = document.getElementById('btn-begin-game');
    Interface.selectCountry = document.getElementById('set-country');
    Interface.unitsList = document.getElementById('units-list');
    
    /*установка сервиса маршрутов*/
    Interface.selectService = document.getElementById('service');
    
     /*обработка кнопки удалить всех установленных юнитов*/
    if ( Interface.button_clear_all ) Interface.button_clear_all.onclick = app.clear;
    
    /*обработка кнопки начала игры*/
    if ( Interface.button_begin_game ) Interface.button_begin_game.onclick = app.begin;   
    
    /*обработка кнопки меню*/
    if (Interface.button_exit) Interface.button_exit.onclick = function(){ Interface.reloadPage('/'); };
    
    /*обработчик клика на метке "Дальше"*/
    if (Interface.label_next) Interface.label_next.onclick = function(){ Interface.reloadPage('/'); };
    
    if (Interface.button_menu) Interface.button_menu.onclick = function(){ Interface.reloadPage('/');};
    
    /*показ описания миссии*/
    if (Interface.label_mission) Interface.label_mission.onmouseover = function(){ Interface.showMission(); };
    
    /*скрытие описания миссии*/
    if (Interface.label_mission) Interface.label_mission.onmouseout = function(){ Interface.hideMission(); }; 

    /*включение скрытия/показа блоков*/
    Interface.hideShowElement( document.getElementById('label-btn-block'), 'Скрыть кнопки', 'Показать кнопки', 'btn-block control-block grad2 font-response hide', 'btn-block control-block grad2 font-response' );
    Interface.hideShowElement( document.getElementById('label-log-block'), 'Скрыть лог', 'Показать лог', 'log-block control-block grad2 font-response hide', 'log-block control-block grad2 font-response' );
    Interface.hideShowElement( document.getElementById('label-info-block'), 'Скрыть сводку', 'Показать сводку', 'info-block control-block grad2 font-response hide', 'info-block control-block grad2 font-response' );

    /*смена сервиса маршрутов*/
    if (Interface.selectService) Interface.selectService.onchange = function(){
		Route.service = Interface.selectService.value;
	};

};    
    /*перезагрузка страницы*/
Interface.reloadPage = function(url){ window.location.replace(url); };
    
/**
* запись сообщения в поле лога
* @param mess массив строк сообщения
**/
Interface.addLog = function(mess){
    this.destroyChildren(this.log_div);
    for ( var i = 0; i < mess.length; i++ ){
        var p = document.createElement('p');
        p.innerText = mess[i];
        p.textContent = mess[i];
        this.log_div.appendChild(p);
    }
};

/**
* запись сообщения в поле сводки
* @param mess массив строк сообщения
**/
Interface.addInfo = function(mess){
    this.destroyChildren(this.info_div);
    for ( var i = 0; i < mess.length; i++ ){
        var p = document.createElement('p');
        p.innerText = mess[i];
        p.textContent = mess[i];
        this.info_div.appendChild(p);
    }
};

/**
* объект для перевода представления данных об юните
**/

Interface.translate = {
    id: 'Идентификатор',
    country: 'Страна',
    type: 'Тип',
    people: 'Личный состав',
    ammo: 'Боеприпасы',
    food: 'Обеспечение',
    discipline: 'Организованность',
    experience: 'Опыт',
    elevation: 'Высота',
    around: 'Окружение',
    battle: 'Бой',
    status: 'Состояние',
    attack: 'Атака',
    defense: 'Оборона',
    march: 'Марш',
    weather: 'Погода'  
};

/**
* удаление дочерних узлов у DOM элемента
* @param node DOM элемент
**/
Interface.destroyChildren = function(node){
  if (!node) return;
  node.innerHTML = '';
  while (node.firstChild)
      node.removeChild(node.firstChild);
}

/**
* показ информации о юните
* @param unit объект содержащий данные об юните
**/
Interface.showUnit = function(unit){
    var ul = document.createElement('ul');
    for ( var item in unit ){
        if ( item == 'weather' ) continue;
        var li = document.createElement('li');
        var value = unit[item];
        if ( typeof(value) == 'boolean' && value == false ) value = 'Нет';
        if ( typeof(value) == 'boolean' && value == true ) value = 'Да';
        if ( typeof(value) == 'string' && this.translate[value] != undefined ) value = this.translate[value];
        var text = this.translate[item] + ': ' + value;
        li.innerText = text;
        li.textContent = text;
        ul.appendChild(li);
    }
    this.destroyChildren(this.unitinfo_div);
    this.destroyChildren(this.weatherinfo_div);
    this.weatherinfo_div.style.display = 'block';
    this.weatherinfo_div.innerHTML = this.formatWeatherData(unit.weather);
    this.unitinfo_div.style.display = 'block';
    this.unitinfo_div.appendChild(ul);
};

/**
* скрытие информации о юните
**/
Interface.hideUnit = function(){
    
    this.destroyChildren(this.unitinfo_div);
    this.unitinfo_div.style.display = 'none';
    this.destroyChildren(this.weatherinfo_div);
    this.weatherinfo_div.style.display = 'none';
};

/**
* показ описания миссии
**/
Interface.showMission = function(){
    var p = document.createElement('p');
    var text = App.game.location.mission;
    p.innerText = text;
    p.textContent = text;
    this.missioninfo_div.style.display = 'block';
    this.missioninfo_div.appendChild(p);
};

/**
* скрытие описания миссии
**/
Interface.hideMission = function(){
    this.destroyChildren(this.missioninfo_div);
    this.unitinfo_div.style.display = 'none';
};

Interface.setMissionDecs = function(text){
    this.missiondesc_p.innerText = text;
    this.missiondesc_p.textContent = text; 
};

/**
* показ контекстного меню юнита
* @param unit объект юнита
**/
Interface.showMenu = function(unit){
    if ( unit.type.id == 'base' ) {
        return this.getBaseMenu(unit);
    }else{
        return this.getRegimentMenu(unit);
    }
};

/**
* показ сообщения об окончании игры 
**/
Interface.showGameOver = function(mess){
    var p = this.gameover_div.firstChild;
    p.innerText = mess;
    p.textContent = mess;
    this.gameover_div.style.display = 'block';
    window.onkeypress = function(e){  if(e.keyCode == 13) this.reloadPage('/');};
};

/**
* функция для скрытия/развертывания блока
* @param el элемент по которому кликаем 
* @param textHide текст элемента для сворачивания
* @param textShow текст элемента для разворачивания
* @param classHide класс присваиваемый для сокрытия
* @param classShow класс присваиваемый для разворачивания
**/
Interface.hideShowElement = function(el, textHide, textShow, classHide, classShow){
    if (!el) return;
    var parent = el.parentNode;
    el.onclick = function(){
        if ( el.innerText == textHide || el.textContent == textHide ){
        el.innerText = textShow;
        el.textContent = textShow;
        parent.className = classHide;
        }else{
            el.innerText = textHide;
            el.textContent = textHide;
            parent.className = classShow;
        }
    }
};

/**
* показ элемента
* @param el объект элемента
**/
Interface.showElem = function(el){
	if (el) el.style.display = 'inline-block';
}
/**
* скрытие элемента
* @param el объект элемента
**/
Interface.hideElem = function(el){
	if (el) el.style.display = 'none';
}




/**
* обновление информации об юните во всплывающем блоке
**/
Interface.updateInfoUnit = function(){
    if ( Interface.unitinfo_div.style.display == 'block' && UnitEvent.overUnit != null){
        this.showUnit(UnitEvent.overUnit.getInfo());
    }  
};

/**
* возвращает html код меню для полка
* @param object объект юнита
**/
Interface.getRegimentMenu = function(object){ 
    var menu = '';
    if (object.OWN ){
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='UnitEvent.unitcontextmenu(0,"+object.id+")'>Стоп</li>\
                        <li onclick='UnitEvent.unitcontextmenu(1,"+object.id+")'>Марш</li>\
                        <li onclick='UnitEvent.unitcontextmenu(2,"+object.id+")'>Оборона</li>\
                        <li onclick='UnitEvent.unitcontextmenu(3,"+object.id+")'>Атака</li>\
                    </ul>";
    }else{
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='UnitEvent.unitcontextmenu(4,"+object.id+")'>Атаковать</li>\
                    </ul>";
    }
    return menu;
};

/**
* возвращает html код меню для базы
* @param object объект юнита
**/
Interface.getBaseMenu = function(object){ 
    var menu = '';
    if (object.OWN ){
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='UnitEvent.unitcontextmenu(5,"+object.id+")'>Стоп</li>\
                        <li onclick='UnitEvent.unitcontextmenu(6,"+object.id+")'>Марш</li>\
                        <li onclick='UnitEvent.unitcontextmenu(7,"+object.id+")'>Оборона</li>\
                    </ul>";
    }else{
        var menu = "<ul id='" + object.id + "'class='regiment unit-menu'>\
                        <li onclick='UnitEvent.unitcontextmenu(8,"+object.id+")'>Уничтожить</li>\
                    </ul>";
    }
    return menu;
};


/**
* возвращает строку сообщения об окончании игры
* @param объект user
* @param won объект user победителя в игре, присланный с сервера
**/
Interface.getGameOverMess = function(){
    return 'Вы проиграли!'; 
};

/**
* показ блоков с кнопками и сообщениями
**/
Interface.showControlBlocks = function(){
    var blocks = document.getElementsByClassName('control-block');
        for ( var i = 0; i < blocks.length; i++ ){
            blocks[i].style.display = 'block';
        }
}

/**
* возвращает html представление для погодных данных
* @param weather объект содержащий погодные данные
* @return html код для отображения в панели погодных данных
**/
Interface.formatWeatherData = function(weather){
    if (weather == null)return '';
    
    var content = '<div class="weather-img">';
    content += (weather.frshht.slice(0,6) == '000000')? '<img class="weather-icon" src="img/weather/sun.png"/>' : '';
    content += (weather.frshht.slice(0,1) == '1')? '<img class="weather-icon" src="img/weather/Fog.png"/>' : '';
    content += (weather.frshht.slice(1,2) == '1')? '<img class="weather-icon" src="img/weather/Rain.png"/>' : '';
    content += (weather.frshht.slice(2,3) == '1')? '<img class="weather-icon" src="img/weather/Snow.png"/>' : '';
    content += (weather.frshht.slice(3,4) == '1')? '<img class="weather-icon" src="img/weather/Hail.png"/>' : '';
    content += (weather.frshht.slice(4,5) == '1')? '<img class="weather-icon" src="img/weather/Thunder.png"/>' : '';
    content += (weather.frshht.slice(5,6) == '1')? '<img class="weather-icon" src="img/weather/Tornado.png"/>' : '';
    content += '</div>';
    
    content += '<div class="weather-line">';
    content += (weather.frshht.slice(0,1) == '1')? ' Туман ' : '';
    content += (weather.frshht.slice(1,2) == '1')? ' Дождь  ' : '';
    content += (weather.frshht.slice(2,3) == '1')? ' Снег ' : '';
    content += (weather.frshht.slice(3,4) == '1')? ' Град ' : '';
    content += (weather.frshht.slice(4,5) == '1')? ' Гроза ' : '';
    content += (weather.frshht.slice(5,6) == '1')? ' Торнадо ' : '';
    content += 'Температура (С): ' + weather.temperature.toFixed(1);
    content += '; Скорость ветра (м/с): ';
    content += (weather.wind != null)? weather.wind.toFixed(1): 'н/д';
    content += '; Давление (мм. рт. ст.): ';
    content += (weather.pressure != null)? 760 * weather.pressure.toFixed(1):'н/д';
    content += '; Видимость (м): ';
    content += (weather.visib != '999.9')? (parseFloat(weather.visib) * 1609).toFixed(1) : 'н/д';
    content += '; Осадков за день(см): ';
    content += (weather.prcp != '99.99')? (parseFloat(weather.prcp.slice(0,4))*2.54).toFixed(1) : 0;
    
    content += '</div>';
    return content;
};  

    