/**
* управление стартовым интерфейсом игры
**/

/**
* объект содержащий элементы интерфейса
**/
var iface = 
{
    wrap_start_div: document.getElementById('wrap-start'),
    map_div: document.getElementById('map'),
    mission_select: null,
    country_select: null,
    parent_mission_select: document.getElementById('td-mission'),
    parent_country_select: document.getElementById('td-country'),
    button_start: document.getElementById('btn-start'),
    input_name: document.getElementById('input-name'),
    error_div: document.getElementById('error-block'),
    button_exit: document.getElementById('btn-exit'),
    button_pause: document.getElementById('btn-pause'),
    log_div: document.getElementById('log-message'),
    info_div: document.getElementById('info-message'),
    unitinfo_div: document.getElementById('unit-info'),
    weatherinfo_div: document.getElementById('weather-info'),
    gameover_div: document.getElementById('game-over'),
    label_next: document.getElementById('label-next'),
    preloader: document.getElementById('preloader'),
    label_mission: document.getElementById('mission-label'),
    missioninfo_div: document.getElementById('mission-info'),
    missiondesc_p: document.getElementById('mission-desc'),
    button_menu: document.getElementById('btn-menu'),
    /*перезагрузка страницы*/
    reloadPage: function(url){ window.location.replace(url); },
    
    /**
    * запись сообщения в поле лога
    * @param mess массив строк сообщения
    **/
    addLog: function(mess){
        destroyChildren(this.log_div);
        for ( var i = 0; i < mess.length; i++ ){
            var p = document.createElement('p');
            p.innerText = mess[i];
            p.textContent = mess[i];
            this.log_div.appendChild(p);
        }
    },
    
    /**
    * запись сообщения в поле сводки
    * @param mess массив строк сообщения
    **/
    addInfo: function(mess){
        destroyChildren(this.info_div);
        for ( var i = 0; i < mess.length; i++ ){
            var p = document.createElement('p');
            p.innerText = mess[i];
            p.textContent = mess[i];
            this.info_div.appendChild(p);
        }
    },
    
    /**
    * показ информации о юните
    * @param unit объект содержащий данные об юните
    **/
    showUnit: function(unit){
        var ul = document.createElement('ul');
        for ( var item in unit ){
            if ( item == 'weather' ) continue;
            var li = document.createElement('li');
            var value = unit[item];
            if ( typeof(value) == 'boolean' && value == false ) value = 'Нет';
            if ( typeof(value) == 'boolean' && value == true ) value = 'Да';
            if ( typeof(value) == 'string' && translate[value] != undefined ) value = translate[value];
            var text = translate[item] + ': ' + value;
            li.innerText = text;
            li.textContent = text;
            ul.appendChild(li);
        }
        destroyChildren(this.unitinfo_div);
        destroyChildren(this.weatherinfo_div);
        this.weatherinfo_div.style.display = 'block';
        this.weatherinfo_div.innerHTML = formatWeatherData(unit.weather);
        this.unitinfo_div.style.display = 'block';
        this.unitinfo_div.appendChild(ul);
    },
    
    /**
    * скрытие информации о юните
    **/
    hideUnit: function(){
        
        destroyChildren(this.unitinfo_div);
        this.unitinfo_div.style.display = 'none';
        destroyChildren(this.weatherinfo_div);
        this.weatherinfo_div.style.display = 'none';
    },
    
    /**
    * показ описания миссии
    **/
    showMission: function(){
        var p = document.createElement('p');
        var text = game.mission.desc[game.country.id];
        p.innerText = text;
        p.textContent = text;
        this.missioninfo_div.style.display = 'block';
        this.missioninfo_div.appendChild(p);
    },
    
    /**
    * скрытие описания миссии
    **/
    hideMission: function(){
        destroyChildren(this.missioninfo_div);
        this.unitinfo_div.style.display = 'none';
    },
    
    setMissionDecs: function(text){
        this.missiondesc_p.innerText = text;
        this.missiondesc_p.textContent = text; 
    },
    
    /**
    * показ контекстного меню юнита
    * @param unit объект юнита
    **/
    showMenu: function(unit){
        if ( unit.type.id == 'base' ) {
            return getBaseMenu(unit);
        }else{
            return getRegimentMenu(unit);
        }
    },
    
    /**
    * показ сообщения об окончании игры 
    **/
    showGameOver: function(mess){
        var p = this.gameover_div.firstChild;
        p.innerText = mess;
        p.textContent = mess;
        this.gameover_div.style.display = 'block';
        window.onkeypress = function(e){  if(e.keyCode == 13) this.reloadPage('/');};
    }  

    

};



/*обработка кнопки меню*/
if (iface.button_exit) iface.button_exit.onclick = btnExitHandler;


/*обработка кнопки паузы*/
//iface.button_pause.onclick = function(){ btnPauseHandler(iface); };

/*обработчик клика на метке "Дальше"*/
if (iface.label_next) iface.label_next.onclick = function(){ iface.reloadPage('/'); };
if (iface.button_menu) iface.button_menu.onclick = function(){ iface.reloadPage('/');};

/*показ описания миссии*/
if (iface.label_mission) iface.label_mission.onmouseover = function(){ iface.showMission(); };

/*скрытие описания миссии*/
if (iface.label_mission) iface.label_mission.onmouseout = function(){ iface.hideMission(); }; 

/*включение скрытия/показа блоков*/
hideShowElement( document.getElementById('label-btn-block'), 'Скрыть кнопки', 'Показать кнопки', 'btn-block control-block grad2 font-response hide', 'btn-block control-block grad2 font-response' );
hideShowElement( document.getElementById('label-log-block'), 'Скрыть лог', 'Показать лог', 'log-block control-block grad2 font-response hide', 'log-block control-block grad2 font-response' );
hideShowElement( document.getElementById('label-info-block'), 'Скрыть сводку', 'Показать сводку', 'info-block control-block grad2 font-response hide', 'info-block control-block grad2 font-response' );

