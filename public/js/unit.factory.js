/**
* фабрика юнитов
**/

var UnitFactory = {};


UnitFactory.init = function(app){
    UnitFactory.unitConstruct = app.unit;/*конструктор юнита*/
    UnitFactory.unitTypes = app.unitTypes; /*объект описывающий типы юнитов*/
    UnitFactory.countries = app.countries;/*объект описывающий страны*/
    UnitFactory.map = app.map;/*объект карты*/
};

UnitFactory.createUnit = function(latlng, type, country, id, userId){
    var unit = new UnitFactory.unitConstruct(latlng, id, userId, UnitFactory.map);
    unit.type = UnitFactory.unitTypes.getType(type);
    unit.country = UnitFactory.countries[country];
    if ( type == 'base' ){
        unit.status.kind = 'defense';
        unit.getInfo = function(){
    		var info = {
        		          id: this.id, 
                          country: this.country.name, 
                          type: this.type.name,
                          people: this.type.resources.men,
                          ammo: this.type.resources.ammo,
                          food:  this.type.resources.food,
                          elevation:  this.elevation,
                          battle: this.battle,
                          status: this.status.kind,
                          weather: this.weather
                      };
    		return info;
        };
    }else{
        unit.getInfo = function(){
    		var info = {
        		          id: this.id, 
                          country: this.country.name, 
                          type: this.type.name,
                          people: this.type.resources.men,
                          ammo: this.type.resources.ammo,
                          food:  this.type.resources.food,
                          discipline: this.type.resources.discipline,
    		              experience: this.type.resources.experience,
                          elevation:  this.elevation,
                          battle: this.battle,
                          status: this.status.kind,
                          weather: this.weather
                      };
    		return info;
    	};
    };
    unit.init();
    return unit;
};