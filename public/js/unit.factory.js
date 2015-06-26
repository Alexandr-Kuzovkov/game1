/**
* фабрика юнитов
**/

var UnitFactory = {};

UnitFactory.unitConstruct = null; /*конструктор юнита*/
UnitFactory.types = null; /*объект описывающий типы юниитов*/
UnitFactory.countries = null; /*объект описывающий страны*/

UnitFactory.init = function(unitConstruct, types, countries){
    UnitFactory.unitConstruct = unitConstruct;
    UnitFactory.types = types;
    UnitFactory.countries = countries;
};

UnitFactory.createUnit = function(latlng, type, country, id, userId){
    var unit = new UnitFactory.unitConstruct(latlng, id, userId);
    unit.type = UnitFactory.types.getType(type);
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
                          around: this.around,
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
                          around: this.around,
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