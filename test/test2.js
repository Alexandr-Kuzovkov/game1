function Marker(latlng){
	this.latlng = latlng;
	this.setLatLng = function(latlng){this.latlng = latlng};
	this.getLatLng = function(){return this.latlng;}
}

function Unit(latlng, id, userId){
	this.latlng = latlng;
	this.id = id;
	this.userId = userId;
	this.getLatLng = function(){ return this.latlng};
	this.getId = function(){ return this.id};
	this.getUserId = function(){ return this.userId};
	this.update = function(data){
		console.log( 'update '+data);
	};
	this.marker = new Marker(latlng);
	this.replace = function(latlng){ this.marker.setLatLng(latlng);};
}


function createUnit(latlng, id, userId, type){
	var unit = new Unit(latlng, id, userId);
	switch(type){
		case 'regiment': unit.type = 'regiment';
		case 'base': unit.type = 'base';
	}
	return unit;
}





var u = new Unit([10,10],1,1);
//u.update(282382);
//console.log(u.getLatLng());

var reg = createUnit([20,20],1,1,'regiment');
var reg2 = createUnit([30,30],2,1,'regiment');
var reg3 = createUnit([46,67],3,1, 'regiment');

console.log(reg.marker.getLatLng());
console.log(reg2.marker.getLatLng());
console.log(reg3.marker.getLatLng());