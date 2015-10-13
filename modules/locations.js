/*описание локаций игры*/
var Locations = {

    iraq: {   
        id: 'iraq',
        name: 'iraq',
        bounds: {SW: [32.5, 43.5], NE: [33.9, 45]},
        countries: ['Russia', 'USA', 'UK', 'Germany', 'Iraq'],
        units: {tank: 1, foot: 0, base: 1},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8010',
        year: 2013
    },
    
    sirya: {   
        id: 'syria',
        name: 'syria',
        bounds: {SW: [33.189267, 36.000493], NE: [33.659194, 36.593755]},
        countries: ['Russia', 'USA', 'UK', 'Germany','Syria'],
        units: {tank: 4, foot: 5, base: 2},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8011',
        year: 2013
    },
    
    vietnam:{   
        id: 'vietnam',
        name: 'vietnam',
        bounds: {SW: [20.393639, 104.745454], NE: [22.249519, 106.644869]},
        countries: ['Russia', 'Vietnam', 'USA', 'UK', 'Germany'],
        units: {tank: 4, foot: 5, base: 2},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8012',
        year: 2013
    },
    
    russia:{   
        id: 'russia',
        name: 'russia',
        bounds: {SW: [20.393639, 104.745454], NE: [22.249519, 106.644869]},
        countries: ['Russia', 'Hato'],
        units: {tank: 20, foot: 20, base: 6},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8013',
        year: 2013
    },
    
    novorossia:{   
        id: 'novorossia',
        name: 'novorossia',
        bounds: {SW: [20.393639, 104.745454], NE: [22.249519, 106.644869]},
        countries: ['Novorossia', 'Ukraine'],
        units: {tank: 20, foot: 20, base: 6},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8014',
        year: 2013
    },
    
     usa:{   
        id: 'usa',
        name: 'usa',
        bounds: {SW: [20.393639, 104.745454], NE: [22.249519, 106.644869]},
        countries: ['USA', 'Confederation'],
        units: {tank: 20, foot: 20, base: 6},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8015',
        year: 2013
    }

};

exports.locations = Locations;