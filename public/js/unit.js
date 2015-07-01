/**
* конструктор объекта игрового юнита
* param latlng координаты [lat,lng]
* param id идентификатор
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
    this.around = false; /*флаг что юнит окружен*/
    this.lastelevation = 0; /*предыдущая высота*/
    this.elevation = 0; /*высота точки нахождения юнита*/
	this.colorPath = 'red'; /*цвет траектории пути*/
	this.battle = false; /*флаг боя*/
    this.lastbattle = false; /*предыдущее значение флага боя*/
    this.enemyCount = 0; /*количество противников*/
    this.weather = null; /*погодные данные*/
    this.latlng = latlng;/*позиция юнита*/
    //this.latlng = L.latLng(latlng[0], latlng[1]);
    this.status = 
    {
        kind: 'march', /*статус юнита; может быть march, attack, defense*/
        defense_coff: 0.5, /*степень ослабления ударов неприятеля в состоянии обороны*/
        attack_coff: 0.5, /*степень ослабления ударной мощи на марше*/
        speed_coff: 0.5  /*степень замедления скорости в атаке*/
    };
    this.popup = map.createPopup(); /*объект всплывающего окна из leaflet http://leafletjs.com/*/
	this.path = map.createPolyline([],this.colorPath); /*объект полилинии пути движения*/
	this.country = '/img/default.png'; /*объект иконки страны принадлежности*/
	this.type = '/img/default.png'; /*объект иконки типа юнита*/     
    
    /*объект иконки выделенного юнита*/ 
    this.iconSelected = '/img/unselected.png';
    
    /*объект иконки невыделенного юнита*/
    this.iconUnselected = '/img/unselected.png';
	
    /*объект иконки изображения боя*/
    this.iconBattle = '/img/battle.gif';
                    
    /*объект иконки изображения взрыва*/
    this.iconExplosion = '/img/explosion.gif';
    
    /*объект маркера юнита, с помощью которого он отображается на карте */
	this.marker = 
	{
		area: map.createCircle(latlng, '#f03', '#f03', 0.1, 0.1 ),
        battle: map.createMarker(latlng, this.iconBattle),
        type: map.createMarker(latlng, this.iconType),
		country: map.createMarker(latlng, this.iconCountry ),
		explosion: map.createMarker(latlng, this.iconExplosion),
        selected: map.createMarker(latlng, this.iconSelected)
    };
    
    /**
    * перемещение юнита в указанную точку
    * @param latlng координаты точки [lat, lng]
    **/
	this.replace = function(latlng){
	   this.latlng = latlng;
       for ( key in this.marker ){
            this.marker[key].setPosition(latlng); 
       }
	};
    
    
    /**
    * возвращает величину DELTA - смещение юнита за один такт (от этого зависит скорость)
    **/
    this.getVelocity = function(){
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
    this.goTo = function(latlng){
		Move.moveMarkerLineAnimation( latlng, this, function(){} );
	};
	
    /**
    * перемещение юнита в точку события по маршруту с анимацией
    * @param latlng объект {lat:lat,lng:lng}
    **/
	this.goRoute = function(latlng){
        var object = this;
        var source = {lat:this.latlng[0], lng: this.latlng[1]};
        Route.getRoute(latlng,source,function(route){    
            Move.moveMarkerRouteAnimation( object, route );
		});	
	};
	
	/**
    * выделение юнита
    **/
    this.select = function(){
		this.selected = true;
		this.marker.selected.setIcon(this.iconSelected);
	};
	
	/**
    * отмена выделения юнита
    **/
    this.unselect = function(){
		this.selected = false;
		this.marker.selected.setIcon(this.iconUnselected);
        map.off('dblclick',null,this);	
	};
    
    /**
    * установка анимации для обозначения состояния боя
    * @param battle устанавливаемый флаг боя
    **/
    this.checkBattle = function(){
        if ( this.battle == this.lastbattle ) return;
        if ( this.battle ){
            this.lastbattle = this.battle;
            this.marker.battle.setIcon(this.iconBattle);
            
        }else{
            this.lastbattle = this.battle;
            this.marker.battle.setIcon(this.iconUnselected);
           
        } 
    };
    
    /**
    * Установка статуса юнита
    * @param status вид статуса
    **/
    this.setStatus = function(status){
        if ( this.status.kind == status ) return false;
        if ( status != 'march' && status != 'attack' && status != 'defense' ){
            return false;
        }
        this.status.kind = status; 
    };
    
    /**
    * инициализация объекта юнита
    **/
    this.init = function(){
		this.marker.type.setIcon(this.type.icon);
		this.marker.country.setIcon(this.country.icon);
        this.iconSelected = ( this.OWN )? '/img/selected.png' : '/img/enemy.selected.png';
        this.marker.area.setRadius(this.type.radius * 111300);
	};
	
	
    /**
    * здесь может быть реализовано обновление состояния юнита
    **/
	this.update = function(){
		/*гибель юнита если нет ресурсов или людей*/
        this.checkBattle();
        if ( this.type.resources.food <= 0 || this.type.resources.men <= 0 ){
            this.marker.explosion.setIcon(this.iconExplosion);
            var self = this;
            setTimeout( function(){game.deleteUnit(self.id);}, 3000);
		} 
	};
    
	/**
    * уничтожение объекта юнита
    **/
    this.destroy = function(){
		this.path.destroy();
		delete this.type;
		this.marker.selected.clearAllEventListeners();
		if ( this.selected ) UnitEvent.removeDblclick(this);
		for ( key in this.marker ) this.marker[key].destroy();
	};
    
    /*преобразование в строку*/
    this.toString = function(){
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
        unit.around = this.around;
        unit.elevation = this.elevation;
        unit.lastelevation = this.lastelevation;
        unit.battle = this.battle;
        unit.status = this.status;
        unit.weather = this.weather;
        unit.enemyCount = this.enemyCount; 
        return unit;  
    };
	
	/*Обработчики событий*/
	
    this.marker.selected.addEventListener('click', function(){UnitEvent.click(this)},this);
	this.marker.selected.addEventListener('contextmenu',function(){UnitEvent.contextmenu(this)},this);
    this.marker.selected.addEventListener('mouseover', function(){UnitEvent.mouseover(this)},this);
    this.marker.selected.addEventListener('mouseout', function(){UnitEvent.mouseout(this)},this);
	
}//end func
