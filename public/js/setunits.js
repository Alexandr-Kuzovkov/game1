var units = {regiments: [], bases: [], country: null}; /*установленные юниты*/
var selectCountry = null;
var unitObject = [];
var unitsList = null;

window.onload = function(){  
    document.getElementById('btn-clear-all').onclick = clear;
    document.getElementById('btn-begin-game').onclick = begin;
}

function showAvailUnits(location){
    selectCountry = document.getElementById('set-country');
    for (var i = 0; i < location.countries.length; i++){
        var opt = document.createElement('option');
        opt.value = location.countries[i];
        opt.innerText = Countries[location.countries[i]][1];
        opt.textContent = Countries[location.countries[i]][1];
        selectCountry.appendChild(opt);
    }
      
    unitsList = document.getElementById('units-list');
    for ( var key in location.units ){
        var li = document.createElement('li');
        var input = document.createElement('input');
        input.type = 'radio';
        input.value = key;
        input.name = 'type';
        input.checked = true;
        li.appendChild(input);
        
        var img = document.createElement('img')
        img.src = '/img/type/'+key+'24.png';
        li.appendChild(img);
        var span = document.createElement('span');
        span.innerText = Types[key][1]+' - ';
        span.textContent = Types[key][1]+' - ';
        li.appendChild(span);
        
        var count = document.createElement('span');
        count.innerText = location.units[key];
        count.textContent = location.units[key];
        count.className ='units-avail';
        li.appendChild(count);
        unitsList.appendChild(li);
    }
    
    map.on('click',makeUnit);   
}

/*получаем выбранный вариант юнита*/
function getRadio(){
    var inputs = document.getElementsByTagName('input');
    for ( var i = 0; i < inputs.length; i++ ){
        if ( inputs[i].attributes.name.value == 'type' )
            if ( inputs[i].attributes.type.value == 'radio' )
                if( inputs[i].checked ) return inputs[i].value;
    }
    return null;
}

/*ставим юнита на карту*/
function makeUnit(e){
    var type = getRadio();
    var country = selectCountry.value;
    var iconCountry = Countries[country][0].icon;
    var typeObject = getType(type);
    var iconType = typeObject.icon;
    var latlng = [e.latlng.lat, e.latlng.lng];
    console.log(latlng);
    var unit = null; 
    if (type=='base'){
        unit = new SupplyBase(latlng, 0, user.id);
        unit.type = getType(type);
        unit.country = Countries[country][0];
        unit.init();
        units.bases.push(unit.toString());
    }else{
        unit = new RegimentBase(latlng, 0, user.id);
        unit.type = getType(type);
        unit.country = Countries[country][0];
        unit.init();
        units.regiments.push(unit.toString());
    }
    unitObject.push(unit);
    units.country = Countries[selectCountry.value][0].toString();
    selectCountry.disabled = 'disabled'; 
}

/*очищаем данные по редактируемой миссии*/
function clear(){
    for ( var key in units ){
        units[key] = [];
    }
    for (var i = 0; i < unitObject.length; i++){
         unitObject[i].destroy();
    }
    selectCountry.removeAttribute('disabled'); 
}

//посылаем данные по юнитам на сервер
function begin(){
    console.log(JSON.stringify(units));
    
    if (units.regiments.length == 0 || units.bases.length == 0){
        alert('Установите юнитов');
        return;
    }
    socket.emit('set_units', {units:units, location:game.location.id, user:user.toString()});
    
}
