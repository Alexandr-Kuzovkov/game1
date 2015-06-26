/**
* модуль обработки http запросов к серверу
**/
var fs = require('fs');


/**
* обработчик GET запроса на '/'
**/
function index(req,res){
    setCookie(req,res);
    var locations = [];
    for (var key in global.locations)
        locations.push({id: global.locations[key].id, name: global.locations[key].name});
    res.render('select',{locations:locations});
}

/**
* обработчик GET запроса на '/location/:loc'
**/
function location(req, res){
    var location = req.params.id;
    setCookie(req,res);
    var user_id = req.cookies.user_id;
    if ( global.sdata.games[location].users[user_id] == undefined ){
        res.render('join',{title:global.locations[location]['name']});
    }else{
        res.render('play',{title:global.locations[location]['name'], countries:global.locations[location]['countries'] });
    }
    
}

/**
* установка cookie user_id если нет во входящем запросе
**/
function setCookie(req,res){
    var id = req.cookies.user_id;
    if ( id == undefined || id == 'undefined')
        res.cookie('user_id',global.helper.getRandomInt(100000000,200000000));
}



exports.index = index;
exports.location = location;

