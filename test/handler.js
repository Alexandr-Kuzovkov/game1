var time = require('./time');
var Helper = require('./helper');
var module = require('./module');

function route1(req,res){
    time.start();
    module.foo1(function(data){
        console.log(data+' Executing time: '+time.stop());
    	res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
        res.write('executing done: '+data);
    	res.end();  
    });
      
}

function route2(req,res){
    time.start();
    module.foo2(function(data){
        console.log(data+' Executing time: '+time.stop());
    	res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
        res.write('executing done: '+data);
    	res.end();  
    });
}

function index(req,res){
   time.start();
    module.index(function(data){
        console.log(data+' Executing time: '+time.stop());
    	res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
        res.write('executing done: '+data);
    	res.end();  
    }); 
}

function find(req,res){
   time.start();
    module.find(function(data){
        console.log(data+' Executing time: '+time.stop());
    	res.writeHead(200, {"Content-Type": "text/html","Access-Control-Allow-Origin": "*"});
        res.write('executing done: '+data);
    	res.end();  
    }); 
}

exports.index = index;
exports.route1 = route1;
exports.route2 = route2;
exports.find = find;