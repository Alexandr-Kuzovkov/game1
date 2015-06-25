/*описание локаций игры*/
var Locations = {

    iraq: {   
        id: 'iraq',
        name: 'Ирак',
        bounds: {SW: [32.5, 43.5], NE: [33.9, 45]},
        countries: ['Russia', 'USA', 'UK', 'Germany', 'Iraq'],
        units: {tank: 4, foot: 5, base: 2}
    },
    
    sirya: {   
        id: 'sirya',
        name: 'Сирия',
        bounds: {SW: [33.189267, 36.000493], NE: [33.659194, 36.593755]},
        countries: ['Russia', 'USA', 'UK', 'Germany','Syria'],
        units: {tank: 4, foot: 5, base: 2}
    },
    
    ukraine:{   
        id: 'ukraine',
        name: 'Украина',
        bounds: {SW: [47.718398, 37.421492], NE: [48.088488, 37.948836]},
        countries: ['Russia', 'Ukraine', 'USA', 'UK', 'Germany'],
        units: {tank: 4, foot: 5, base: 2}
    }





};

exports.locations = Locations;