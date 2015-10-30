var http = require('http');
var ELEVATION_SERVICE_HOSTNAME = '127.0.0.1'; /*хост сервиса высот*/
var ELEVATION_SERVICE_PORT = 8002; /*порт сервиса высот*/
var delta = 0.01;
var FAIL = -1000000;
var updatePeriod = 3000;//ms
var unitsPositionsHash = []; /*массив хешей позиций юнитов*/
var unitsPreviousCoordinates = [];
var basesPreviousCoordinates = [];
var queue = []; /*массив ключей локаций в объекте локаций*/

/**
* старт процесса обновления высот юнитов
* @param games объект содержащий объекты игр в локациях
* @param locations объект описывающий локации
**/
function startUpdateElevation(games, locations){
    for (var loc in locations){
        queue.push(loc);
        unitsPositionsHash.push(0);
    }
    begin(games, locations);
}

/**
* функция обновления высот, вызываемая через таймаут
* @param games объект содержащий объекты игр в локациях
* @param locations объект описывающий локации
**/
function begin(games, locations){
    updateElevationRun(0, games, locations, function(){
        setTimeout(begin, updatePeriod, games, locations);
    });
}

/**
* обновление высот юнитов в определенной локации
* @param index локации в массиве ключей локаций
* @param games объект содержащий объекты игр в локациях
* @param locations объект описывающий локации
* @param callback функция обратного вызова, вызываемая по завершении операции
**/
function updateElevationRun(index, games, locations, callback){
    updateElevation(index, games[queue[index]], function(){
        index++;
        if ( index < queue.length ){
            updateElevationRun(index, games, locations, callback);
        }else{
            callback();
        }
    });
}


/**
* получение высот точек от сервиса высотных данных
* и обновление в соответсвии с ними объектов юнитов
* в объекте игры game
* @param index индекс хеша в массиве хешей юнитов
* @param game объект игры
* @callback функция обратного вызова, вызываемая по завершении операции
**/
function updateElevation(index, game, callback){
    
     /*проверяем было ли изменение положения юнитов*/
    var hash = calcUnitsPositionsHash(game);
    if ( unitsPositionsHash[index] == hash ){
        callback();
        return;
    }
    unitsPositionsHash[index] = hash;
    
    var dots = prepareDots(game);

    //удаляем undefined элементы
    var clearDots = dots.filter(function(x) {
        return x !== undefined && x !== null;
    });
    if (clearDots.length == 0){
        callback();
        return;
    }
  
    getElevations(clearDots, function(result){
        updateGameObject(game, result, callback);
    }); 
}

/**
* получение хеша из позиций юнитов с целью определения 
* было ли движение юнитов или нет
* @param game объект игры
* @return hash хеш от положений юнитов
**/
function calcUnitsPositionsHash(game){
    var hash = 0;
    for (var i = 0; i < game.regiments.length; i++){
        hash += game.regiments[i].latlng[0] + game.regiments[i].latlng[1];
    }
    for (var i = 0; i < game.bases.length; i++){
        hash += game.bases[i].latlng[0] + game.bases[i].latlng[1];
    }
    return hash;
}

//подготавливаем только юнитов у которых изменились координаты, сохраняем текущие координаты
function savePreviousCoordinates(offcet, dots,source) {
    var number = source.length;
    for (var i = 0; i < number; i++ ) {
        var u = i + offcet;

        if (source[i] == undefined) continue;//TODO: когдда может быть такая ситуэшн?
/*
        if (source[i] == undefined) {
            console.log(i);
            console.log(source);

            return 0;
        }
        else {
            console.log(i + ' ! ');
            console.log(source);
        }
        */
        if (unitsPreviousCoordinates[u] == undefined) {
            dots[u][0] = source[i].latlng[0];
            dots[u][1] = source[i].latlng[1];
        }
        else {
            if (source[i].latlng[0] != unitsPreviousCoordinates[u][0] || source[i].latlng[1] != unitsPreviousCoordinates[u][1]) {
                dots[u][0] = source[i].latlng[0];
                dots[u][1] = source[i].latlng[1];
            }
        }

        unitsPreviousCoordinates[u] = [source[i].latlng[0], source[i].latlng[1]];
    }
}

/**
* подготовка массива с координатами юнитов игры
* @param game объект игры
**/
function prepareDots(game){
    var dots = [];
    var rNumber = game.regiments.length;
    var bNumber = game.bases.length;

    for (var i = 0; i < rNumber + bNumber; i++)
        dots.push([0,0]);

    //подготавливаем только юнитов и базы у которых изменились координаты
    savePreviousCoordinates(0, dots, game.regiments);
    savePreviousCoordinates(rNumber, dots, game.bases);
    
    return dots;
}

/**
*обновление поля elevation у юнитов игры
* @param game объект игры
* @param result результат запроса к сервису высот
* @param callback функция обратного вызова, вызываемая по завершении операции
**/
function updateGameObject(game, result, callback){
    if ( result == undefined ) return false;
    for ( var i = 0; i < game.regiments.length; i++ ){
        if ( game.regiments[i] == undefined ) continue;
        var el = findNearest(game.regiments[i].latlng, result);
        if ( el != FAIL ) game.regiments[i].elevation = el;
    }
    for ( var i = 0; i < game.bases.length; i++ ){
        if ( game.bases[i] == undefined ) continue;
        var el = findNearest(game.bases[i].latlng, result);
        if ( el != FAIL ) game.bases[i].elevation = el;
    }
    callback();
}

/**
* нахождение квадрата расстояния между точками (без учета кривизны)
**/
function getSquareDist( x, y ){
	return ( (x[0]-y[0])*(x[0]-y[0]) + (x[1]-y[1])*(x[1]-y[1]) );
}

/**
* нахождение в массиве результатов результата ближайшего к заданной точке 
* @param dot точка, заданная кординатами [lat,lng]
* @param array массив объектов [{lat:lat,lng:lng,elevation:elevation}, ...]
**/
function findNearest( dot, array ){
    if ( array.length == 0 ) return FAIL;
    var el = array[0]['elevation'];
    var minDist = getSquareDist(dot, [array[0]['lat'], array[0]['lng']]);
    for ( var i = 0; i < array.length; i++ ){
        currDist = getSquareDist(dot, [array[i]['lat'], array[i]['lng']]);
        if ( currDist < minDist ){
            minDist = currDist;
            el = array[i]['elevation'];
        }
    }
    return el;
}

/**
* получение данных  через отправку HTTP POST запроса 
* @param dots массив точек своих полков и баз вида [[lat1,lng1],[lat2,lng2],...]
* @param callback функция обратного вызова, в которую передается результата в 
* виде массива объектов [{lat:lat,lng:lng,elevation:elevation}, ...]
**/
function getElevations( dots, callback ){
    var path = '/elevations';
    var params = 'data=' + JSON.stringify(dots);
    var results = [];
    var options = {
                        hostname: ELEVATION_SERVICE_HOSTNAME,
                        port: ELEVATION_SERVICE_PORT,
                        path: path,
                        method: 'POST',
                        headers: {'Content-type': 'application/x-www-form-urlencoded'}
                    };
            
    var req = http.request(options, function(res){
        if ( res.statusCode === 200 ){
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    results.push(chunk);
                });
                res.on('end',function(){
                   var result = JSON.parse(results.join(''));
                   callback(result); 
                });
        }
        else{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    //console.log(chunk);
                    callback(undefined);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    
    // write data to request body
    req.write(params);
    req.end();
}

exports.startUpdateElevation = startUpdateElevation;