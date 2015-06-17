function getTime(){
    var d = new Date();
    var time= d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+'  '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    console.log(time);
}

function foo(){
	getTime();
	setTimeout(foo, 2000);
}

var interval = setTimeout(foo, 2000);
