var JoinUser = {};
JoinUser.units = {regiments: [], bases: [], country: null}; /*установленные юниты*/
JoinUser.selectCountry = null;
JoinUser.unitObject = [];
JoinUser.unitsList = null;
JoinUser.app = null; 

JoinUser.init = function(app){
    JoinUser.app = app;
};

/*показ меню установки юниов на карту*/
JoinUser.showAvailUnits = function(location){
    for (var i = 0; i < location.countries.length; i++){
        var opt = document.createElement('option');
        opt.value = location.countries[i];
       
        opt.innerText = Countries[location.countries[i]].name;
        opt.textContent = Countries[location.countries[i]].name;
        JoinUser.app.iface.selectCountry.appendChild(opt);
    }
      
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
        span.innerText = UnitTypes.names[key]+' - ';
        span.textContent = UnitTypes.names[key]+' - ';
        li.appendChild(span);
        
        var count = document.createElement('span');
        count.innerText = location.units[key];
        count.textContent = location.units[key];
        count.className ='units-avail';
        li.appendChild(count);
        JoinUser.app.iface.unitsList.appendChild(li);
    }   
    JoinUser.app.map.addEventListener('click',JoinUser.makeUnit);   
};

/*получаем выбранный вариант юнита*/
JoinUser.getRadio = function(){
    var inputs = document.getElementsByTagName('input');
    for ( var i = 0; i < inputs.length; i++ ){
        if ( inputs[i].attributes.name.value == 'type' )
            if ( inputs[i].attributes.type.value == 'radio' )
                if( inputs[i].checked ) return inputs[i].value;
    }
    return null;
};

/*ставим юнита на карту*/
JoinUser.makeUnit = function(e){
    var type = JoinUser.getRadio();
    var country = JoinUser.app.iface.selectCountry.value;
    var iconCountry = Countries[country].icon;
    var typeObject = UnitTypes.getType(type);
    var iconType = typeObject.icon;
    var latlng = [e.latlng.lat, e.latlng.lng];
    console.log(latlng);
    var unit = null; 
    var unit = UnitFactory.createUnit(latlng, type, country, 0, JoinUser.app.user.id);
    unit.init();
    if ( unit.type.id == 'base'){
        JoinUser.units.bases.push(unit.toString());
    }else{
        JoinUser.units.regiments.push(unit.toString());
    }
    JoinUser.unitObject.push(unit);
    JoinUser.units.country = Countries[JoinUser.app.iface.selectCountry.value].toString();
    JoinUser.app.iface.selectCountry.disabled = 'disabled'; 
};

/*очищаем данные по редактируемой миссии*/
JoinUser.clear = function(){
    for ( var key in units ){
        units[key] = [];
    }
    for (var i = 0; i < JoinUser.unitObject.length; i++){
         JoinUser.unitObject[i].destroy();
    }
    JoinUser.app.iface.selectCountry.removeAttribute('disabled'); 
};

//посылаем данные по юнитам на сервер
JoinUser.begin = function(){
    console.log(JSON.stringify(JoinUser.units));
    
    if (JoinUser.units.regiments.length == 0 || JoinUser.units.bases.length == 0){
        alert('Установите юнитов');
        return;
    }
       
    JoinUser.app.socket.send('set_units', {units:JoinUser.units, location:game.location.id, user:user.toString()});
    
}
