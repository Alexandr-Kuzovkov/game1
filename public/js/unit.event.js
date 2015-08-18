/**
* объект, содержащий обработчики событий
* для юнитов
**/

var UnitEvent = 
{
    app: null,/*объект приложения*/
     
    init: function(app){
        UnitEvent.app = app; 
    },
    
    /**
    * обработчик события  click на юните
    * @param object объект юнита Regiment или Base
    * @param map объект карты Map
    * @param game клиентский объект игры Game 
    **/
    click: function(object){
        if ( object.selected ){
			object.unselect();
		}
		else{
			if ( !object.OWN ) UnitEvent.app.game.unselectNotOwn();
			object.select();
			if ( object.OWN ){
			     UnitEvent.app.map.addOneTimeEventListener('dblclick', function(e){
    				UnitEvent.dblclick(e,object);
    			},object);
			}
            else{
                object.marker.selected.addOneTimeEventListener('dblclick',function(){
                    UnitEvent.attack(object.id);
                },object);
            }       
		}
    },
    
    /**
    * обработчик события  doubleclick на юните
    * @param object объект юнита 
    * @param e объект события
    **/
    dblclick: function(e, object){
        var latlng = {lat: e.latlng.lat, lng: e.latlng.lng};
        UnitEvent.app.unitGoRoute(object,[e.latlng.lat, e.latlng.lng]);
        object.unselect();
    			
    },
    
    /**
    * обработчик события клика правой кнопкой мыши на юните
    * @param object объект юнита Regiment или Base
    * @param map объект карты Map
    **/
    contextmenu: function(object){
           object.popup.show(object.latlng, UnitEvent.app.iface.showMenu(object));   
    },
    
    /**
    * удаление обработчика события  doubleclick с юнита
    * @param object объект юнита Regiment или Base
    * @param map объект карты Map
    **/
    removeDblclick: function(object){
        UnitEvent.app.map.removeEventListener('dblclick',null,object);
    },
    
    mouseover: function(object){
         for ( marker in object.marker ) {
            if ( marker != 'area' )object.marker[marker].setOpacity(0.7);
         }
         UnitEvent.app.iface.showUnit(object.getInfo());
         this.overUnit = object;      
    },
    
    mouseout: function(object){
         for ( marker in object.marker ) {
            if ( marker != 'area') object.marker[marker].setOpacity(1.0);
         }
         UnitEvent.app.iface.hideUnit();
         this.overUnit = null;
    },
    
    overUnit: null,
    
    /**
    * обработчики контектсного меню
    * @param id индекс функции обработчика
    * @param objectId id объекта юнита
    **/
    unitcontextmenu: function(id, objectId){
        var contextMenuHandler = [
                            this.ownRegStop, /*отмена марша своего полка*/
                            this.ownRegMarch,       /*включение состояния полка марш*/
                            this.ownRegDefense,  /*включение состояния полка оборона*/
                            this.ownRegAttack,   /*включение состояния атаки*/
                            this.attack,         /*команда на атаку вражеского полка*/
                            this.ownBaseStop, /*отмена марша своей базы*/
                            this.ownBaseMarch,      /*включение состояния базы марш*/
                            this.ownBaseDefense, /*включение состояния базы оборона*/
                            this.baseCapture,     /*команда на захват вражеской базы*/
                            this.createConvoy /*cоздание конвоя*/
                        ];
        contextMenuHandler[id](objectId);
    },
    
    /*отмена марша своего полка*/
    ownRegStop: function(id){  
        var object = UnitEvent.app.game.getRegiment(id);
        if ( object == null || object.MOVE == false ) return false;
        object.STOP = true;
    },
    
    /*включение состояния полка марш*/
    ownRegMarch: function(id){
        var object = UnitEvent.app.game.getRegiment(id);
        if ( object == null ) return false;
        object.setStatus('march');
    },
    
    /*включение состояния полка оборона*/
    ownRegDefense: function(id){
        var object = UnitEvent.app.game.getRegiment(id);
        if ( object == null ) return false;
        if (object.MOVE) object.STOP = true;
        object.setStatus('defense')
    },
    
    /*включение состояния атаки*/
    ownRegAttack: function(id){
        var object = UnitEvent.app.game.getRegiment(id);
        if ( object == null ) return false;
        object.setStatus('attack')
    },
    
    /*команда на атаку вражеского полка*/
    attack: function(id){
        var object = UnitEvent.app.game.getRegiment(id);
        if ( object == null ) return false;
        var latlng  = { lat: object.toString().latlng[0], lng: object.toString().latlng[1] };
        for ( var i = 0; i < UnitEvent.app.game.regiments.length; i++ ){
            if ( UnitEvent.app.game.regiments[i].OWN && UnitEvent.app.game.regiments[i].selected ){
                UnitEvent.app.game.regiments[i].setStatus('attack');
                UnitEvent.app.unitGoRoute(UnitEvent.app.game.regiments[i],[latlng.lat, latlng.lng]);
            }
        }
    },
    
    /*отмена марша своей базы*/
    ownBaseStop: function(id){
        var object = UnitEvent.app.game.getBase(id);
        if ( object == null || object.MOVE == false ) return false;
        object.STOP = true;
    },
    
    /*включение состояния базы марш*/
    ownBaseMarch: function(id){
        var object = UnitEvent.app.game.getBase(id);
        if ( object == null ) return false;
        object.setStatus('march');
    },
    
    /*включение состояния базы оборона*/
    ownBaseDefense: function(id){
        var object = UnitEvent.app.game.getBase(id);
        if ( object == null ) return false;
        if (object.MOVE) object.STOP = true;
        object.setStatus('defense');
    },
    
    /*команда на захват вражеской базы*/
    baseCapture: function(id){
        var object = UnitEvent.app.game.getBase(id);
        if ( object == null ) return false;
        var latlng  = { lat: object.toString().latlng[0], lng: object.toString().latlng[1] };
        for ( var i = 0; i < UnitEvent.app.game.regiments.length; i++ ){
            if ( UnitEvent.app.game.regiments[i].OWN && UnitEvent.app.game.regiments[i].selected ){
                UnitEvent.app.game.regiments[i].setStatus('attack');
                UnitEvent.app.unitGoRoute(UnitEvent.app.game.regiments[i],[latlng.lat, latlng.lng]);
            }
        }
    },
    
    /*создание конвоя*/
    createConvoy: function(id){
        /*
        var object = UnitEvent.app.game.getBase(id);
        if ( object == null ) return false;
        var latlng = [object.latlng[0]+0.01, object.latlng[1]+0.01];
        var country = UnitEvent.app.game.country.id;
        var type = 'convoy';
        var userId = UnitEvent.app.user.id;
        UnitEvent.app.game.createRegiment(latlng, country, type, 0, userId);
        */
    }
                   
}