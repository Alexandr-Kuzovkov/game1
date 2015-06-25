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


function Regiment(latlng, id, userId){
	this.type = 'regiment';
	this.latlng = latlng;
	this.id = id;
	this.userId = userId;
	this.replace(latlng);
}

Regiment.prototype = new Unit([0,0],0,0);





var u = new Unit([10,10],1,1);
//u.update(282382);
//console.log(u.getLatLng());

var reg = new Regiment([20,20],1,1);
var reg2 = new Regiment([30,30],2,1);
var reg3 = new Regiment([46,67],3,1);

console.log(reg.marker.getLatLng());
console.log(reg2.marker.getLatLng());
console.log(reg3.marker.getLatLng());