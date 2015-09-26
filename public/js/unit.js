/**
* конструктор объекта игрового юнита
* @param latlng координаты [lat,lng]
* @param id идентификатор
* @param userId идентификатор пользователя
* @param map объект карты
**/
function Unit( latlng, id, userId, map )
{
	/*Свойства*/
	this.userId = userId; /*id игрока*/
    this.id = id;   /*идентификатор*/
	this.MOVE = false;/*флаг находится ли юнит в движении*/
    this.STOP = false; /*флаг сигнала на остановку*/
    this.OWN = false; /*флаг свой ли юнит*/
	this.selected = false; /*флаг что юнит выбран*/
    this.lastelevation = 0; /*предыдущая высота*/
    this.elevation = 0; /*высота точки нахождения юнита*/
	this.colorPath = 'red'; /*цвет траектории пути*/
	this.battle = false; /*флаг боя*/
    this.lastbattle = false; /*предыдущее значение флага боя*/
    this.enemyCount = 0; /*количество противников*/
    this.weather = null; /*погодные данные*/
    this.latlng = latlng;/*позиция юнита [lat,lng]*/
    this.visible = true; /*видимость юнита*/
    this.map = map; /*ссылка на объект карты*/
    this.died = false; /*флаг состояния близкого к гибели*/
    this.lastdied = false; /*предыдущее значение флага died*/
    this.priority = 1; /*приоритет юнита*/
    this.status = 
    {
        kind: 'march', /*статус юнита; может быть march, attack, defense*/
        defense_coff: 0.5, /*степень ослабления ударов неприятеля в состоянии обороны*/
        attack_coff: 0.5, /*степень ослабления ударной мощи на марше*/
        speed_coff: 0.5  /*степень замедления скорости в атаке*/
    };
    this.popup = this.map.createPopup(); /*объект всплывающего окна из leaflet http://leafletjs.com/*/
	this.iconCountry = {    url:'/img/default.png', /*объект иконки страны принадлежности*/
                            size: [24,24],
                            anchor: [12,12],
                            shadowanchor: [4,23],
                            popupanchor: [-3,-23]
    }; 
                            
	this.iconType = {  url:'/img/default.png', /*объект иконки типа юнита*/ 
                            size: [24,24],
                            anchor: [12,12],
                            shadowanchor: [4,23],
                            popupanchor: [-3,-23]
    };     
    
    /*объект иконки выделенного юнита*/ 
    this.iconSelected = {   url:'/img/unselected.png',
                            size: [50,50],
                            anchor: [25,25],
                            shadowanchor: [4,23],
                            popupanchor: [-3,-23]
    };
    
    /*объект иконки невыделенного юнита*/
    this.iconUnselected = { url:'/img/unselected.png',
                            size: [50,50],
                            anchor: [25,25],
                            shadowanchor: [4,23],
                            popupanchor: [-3,-23]
    };
	
    /*объект иконки изображения боя*/
    this.iconBattle = { url:'/img/battle.gif',
                            size: [60,60],
                            anchor: [30,30],
                            shadowanchor: [4,23],
                            popupanchor: [-3,-23]
    };
                    
    /*объект иконки изображения взрыва*/
    this.iconExplosion = { url:'/img/explosion.gif',
                            size: [50,60],
                            anchor: [25,30],
                            shadowanchor: [4,23],
                            popupanchor: [-3,-23]
    };
    
    /*объект маркера юнита, с помощью которого он отображается на карте */
	this.marker = 
	{
		area: this.map.createCircle(latlng, '#f03', '#f03', 0.1, 0.1 ),
        battle: this.map.createMarker(latlng, this.iconUnselected),
        type: this.map.createMarker(latlng, this.iconType),
		country: this.map.createMarker(latlng, this.iconCountry ),
		explosion: this.map.createMarker(latlng, this.iconUnselected),
        selected: this.map.createMarker(latlng, this.iconUnselected)
    };
    
}//end func   
    
    
/**
* перемещение юнита в указанную точку
* @param latlng координаты точки [lat, lng]
**/
Unit.prototype.replace = function(latlng){
   this.latlng = latlng;
   for ( key in this.marker ){
        this.marker[key].setPosition(latlng); 
   }
};


/**
* возвращает величину DELTA - смещение юнита за один такт (от этого зависит скорость)
**/
Unit.prototype.getVelocity = function(){
    /*зависимость скорости от рельефа*/
    var k = 0.1;
    if ( this.elevation == 0 || this.lastelevation == 0 ){
        var elevationCoff = 1;
    }else{
        var elevationCoff = ( 1 + k * ( (this.lastelevation - this.elevation) / this.elevation )) ;
    }
    
    /*понижение скорости в атаке*/
    var coff = ( this.status.kind == 'attack' )? this.status.speed_coff : 1;
    return this.type.VELOCITY * elevationCoff * coff;
};

/**
* перемещение юнита в точку события по прямой с анимацией
* @param latlng объект {lat:lat,lng:lng}
**/
Unit.prototype.goTo = function(latlng){
	Move.moveUnitLineAnimation( latlng, this, function(){} );
};

/**
* перемещение юнита в точку события по маршруту с анимацией
* @param latlng объект {lat:lat,lng:lng}
**/
Unit.prototype.goRoute = function(latlng){
    var object = this;
    var source = {lat:this.latlng[0], lng: this.latlng[1]};
    Route.getRoute(latlng,source,function(route){    
        Move.moveUnitRouteAnimation( object, route );
	});	
};

/**
* выделение юнита
**/
Unit.prototype.select = function(){
	this.selected = true;
	this.marker.selected.setIcon(this.iconSelected);
};

/**
* отмена выделения юнита
**/
Unit.prototype.unselect = function(){
	this.selected = false;
	this.marker.selected.setIcon(this.iconUnselected);
    this.map.removeEventListener('dblclick',null,this);	
};

/**
* установка анимации для обозначения состояния боя
* @param battle устанавливаемый флаг боя
**/
Unit.prototype.setBattleAnimation = function(){
    if ( this.battle == this.lastbattle ) return;
    this.lastbattle = this.battle;
    if ( this.battle ){
        if (this.marker.battle)
            this.marker.battle.setIcon(this.iconBattle);
    }else{
        if (this.marker.battle)
            this.marker.battle.setIcon(this.iconUnselected);
    } 
};

/**
* Установка статуса юнита
* @param status вид статуса
**/
Unit.prototype.setStatus = function(status){
    if ( this.status.kind == status ) return false;
    if ( status != 'march' && status != 'attack' && status != 'defense' ){
        return false;
    }
    this.status.kind = status; 
};

/**
* инициализация объекта юнита
**/
Unit.prototype.init = function(){
	this.marker.type.setIcon(this.type.icon);
	this.marker.country.setIcon(this.country.icon);
    this.iconSelected.url = ( this.OWN )? '/img/selected.png' : '/img/enemy.selected.png';
    this.marker.area.setRadius(this.type.radius * 111300);
    this.path = this.map.createPolyline([],this.colorPath); /*объект полилинии пути движения*/
    this.setListeners();
    this.onInit();
};

/**
* показ юнита
**/
Unit.prototype.show = function(){
    this.marker = 
	{
		area: this.map.createCircle(this.latlng, '#f03', '#f03', 0.1, 0.1 ),
        battle: this.map.createMarker(this.latlng, this.iconUnselected),
        type: this.map.createMarker(this.latlng, this.iconType),
		country: this.map.createMarker(this.latlng, this.iconCountry ),
		explosion: this.map.createMarker(this.latlng, this.iconUnselected),
        selected: this.map.createMarker(this.latlng, this.iconUnselected)
    };
    this.init();
    this.visible = true;
};

/**
* сокрытие юнита
**/ 
Unit.prototype.hide = function(){
    this.destroy();
    this.marker = {};
    this.visible = false;
};


/**
* здесь может быть реализовано обновление состояния юнита
**/
Unit.prototype.update = function(){
    this.setBattleAnimation();
    this.setDiedAnimation();
};

/**
* установка анимации гибели юнита
**/
Unit.prototype.setDiedAnimation = function(){
    if ( this.died == this.lastdied ) return;
    this.lastdied = this.died;
    if ( this.died ){
        if (this.marker.explosion)
            this.marker.explosion.setIcon(this.iconExplosion);
        
    }else{
        if (this.marker.explosion)
            this.marker.explosion.setIcon(this.iconUnselected);
    }
};

/**
* уничтожение объекта юнита
**/
Unit.prototype.destroy = function(){	
    this.path.destroy();
	this.marker.selected.clearAllEventListeners();
	if ( this.selected ) Mouse.removeDblclick(this);
	for ( key in this.marker ) this.marker[key].destroy();
};

/*преобразование объекта в вид который может быть преобразован в строку*/
Unit.prototype.toString = function(){
    var unit = {};
    unit.country = this.country.toString();
    unit.type = this.type.toString();
    unit.id = this.id;
    unit.userId = this.userId;
    unit.MOVE = this.MOVE;
    unit.OWN = this.OWN;
    unit.latlng = this.latlng;
    unit.selected = this.selected;
    unit.colorPath = this.colorPath;
    unit.elevation = this.elevation;
    unit.lastelevation = this.lastelevation;
    unit.battle = this.battle;
    unit.died = this.died;
    unit.status = this.status;
    unit.weather = this.weather;
    unit.enemyCount = this.enemyCount;
    unit.priority = this.priority; 
    return unit;  
};

/**
* обработчик события инициализации юнита
**/
Unit.prototype.onInit = function(){
    
};

/*Обработчики событий*/

Unit.prototype.setListeners = function(){
    this.marker.selected.clearAllEventListeners();
    this.marker.selected.addEventListener('click', function(){Mouse.click(this)},this);
	this.marker.selected.addEventListener('contextmenu',function(){Mouse.contextmenu(this)},this);
    this.marker.selected.addEventListener('mouseover', function(){Mouse.mouseover(this)},this);
    this.marker.selected.addEventListener('mouseout', function(){Mouse.mouseout(this)},this);
};

/**
* добавление id дочерних юнитов
* @param id идентификатор дочернего юнита 
**/
Unit.prototype.addChild = function(id){
   
};

/**
* удаление id дочернего юнита
* @param id идентификатор дочернего юнита
**/
Unit.prototype.delChild = function(id){
    
};

/**
* установка приоритета юнита
* @param priority приоритет (0-1)
**/
Unit.prototype.setPriority = function(priority){
    if (priority < 0 || priority > 1) priority = 1
    this.priority = priority
}