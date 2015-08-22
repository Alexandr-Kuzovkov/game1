/**
* объект, содержащий обработчики событий
* для юнитов
**/

var Mouse = 
{
    app: null,/*объект приложения*/
     
    init: function(app){
        Mouse.app = app; 
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
			if ( !object.OWN ) Mouse.app.game.unselectNotOwn();
			object.select();
			if ( object.OWN ){
			     Mouse.app.map.addOneTimeEventListener('dblclick', function(e){
    				Mouse.dblclick(e,object);
    			},object);
			}
            else{
                object.marker.selected.addOneTimeEventListener('dblclick',function(){
                    Mouse.attack(object.id);
                },object);
            }       
		}
    },
    
    /**
    * обработчик события  doubleclick на карте
    * @param object объект юнита 
    * @param e объект события
    **/
    dblclick: function(e, object){
        var latlng = {lat: e.latlng.lat, lng: e.latlng.lng};
        Mouse.app.unitGoRoute(object,[e.latlng.lat, e.latlng.lng]);
        object.unselect();
    			
    },
    
    /**
    * обработчик события клика правой кнопкой мыши на юните
    * @param object объект юнита Regiment или Base
    * @param map объект карты Map
    **/
    contextmenu: function(object){
           object.popup.show(object.latlng, Mouse.app.iface.showMenu(object));   
    },
    
    /**
    * удаление обработчика события  doubleclick с юнита
    * @param object объект юнита Regiment или Base
    * @param map объект карты Map
    **/
    removeDblclick: function(object){
        Mouse.app.map.removeEventListener('dblclick',null,object);
    },
    
    mouseover: function(object){
         for ( marker in object.marker ) {
            if ( marker != 'area' )object.marker[marker].setOpacity(0.7);
         }
         Mouse.app.iface.showUnit(object.getInfo());
         this.overUnit = object;      
    },
    
    mouseout: function(object){
         for ( marker in object.marker ) {
            if ( marker != 'area') object.marker[marker].setOpacity(1.0);
         }
         Mouse.app.iface.hideUnit();
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
        var object = Mouse.app.game.getRegiment(id);
        if ( object == null || object.MOVE == false ) return false;
        object.STOP = true;
    },
    
    /*включение состояния полка марш*/
    ownRegMarch: function(id){
        var object = Mouse.app.game.getRegiment(id);
        if ( object == null ) return false;
        object.setStatus('march');
    },
    
    /*включение состояния полка оборона*/
    ownRegDefense: function(id){
        var object = Mouse.app.game.getRegiment(id);
        if ( object == null ) return false;
        if (object.MOVE) object.STOP = true;
        object.setStatus('defense')
    },
    
    /*включение состояния атаки*/
    ownRegAttack: function(id){
        var object = Mouse.app.game.getRegiment(id);
        if ( object == null ) return false;
        object.setStatus('attack')
    },
    
    /*команда на атаку вражеского полка*/
    attack: function(id){
        var object = Mouse.app.game.getRegiment(id);
        if ( object == null ) return false;
        var latlng  = { lat: object.toString().latlng[0], lng: object.toString().latlng[1] };
        for ( var i = 0; i < Mouse.app.game.regiments.length; i++ ){
            if ( Mouse.app.game.regiments[i].OWN && Mouse.app.game.regiments[i].selected ){
                Mouse.app.game.regiments[i].setStatus('attack');
                Mouse.app.unitGoRoute(Mouse.app.game.regiments[i],[latlng.lat, latlng.lng]);
            }
        }
    },
    
    /*отмена марша своей базы*/
    ownBaseStop: function(id){
        var object = Mouse.app.game.getBase(id);
        if ( object == null || object.MOVE == false ) return false;
        object.STOP = true;
    },
    
    /*включение состояния базы марш*/
    ownBaseMarch: function(id){
        var object = Mouse.app.game.getBase(id);
        if ( object == null ) return false;
        object.setStatus('march');
    },
    
    /*включение состояния базы оборона*/
    ownBaseDefense: function(id){
        var object = Mouse.app.game.getBase(id);
        if ( object == null ) return false;
        if (object.MOVE) object.STOP = true;
        object.setStatus('defense');
    },
    
    /*команда на захват вражеской базы*/
    baseCapture: function(id){
        var object = Mouse.app.game.getBase(id);
        if ( object == null ) return false;
        var latlng  = { lat: object.toString().latlng[0], lng: object.toString().latlng[1] };
        for ( var i = 0; i < Mouse.app.game.regiments.length; i++ ){
            if ( Mouse.app.game.regiments[i].OWN && Mouse.app.game.regiments[i].selected ){
                Mouse.app.game.regiments[i].setStatus('attack');
                Mouse.app.unitGoRoute(Mouse.app.game.regiments[i],[latlng.lat, latlng.lng]);
            }
        }
    },
    
    /*создание конвоя*/
    createConvoy: function(id){
        App.addUnit(id, 'convoy');
    }
                   
}