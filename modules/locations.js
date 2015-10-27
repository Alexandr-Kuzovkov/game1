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
        year: 2013,
        minZoom: 1,
        maxZoom: 14
    },
    
    sirya: {   
        id: 'syria',
        name: 'syria',
        bounds: {SW: [33.189267, 36.000493], NE: [33.659194, 36.593755]},
        countries: ['Russia', 'USA', 'UK', 'Germany','Syria'],
        units: {tank: 4, foot: 5, base: 2},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8011',
        year: 2013,
        minZoom: 12,
        maxZoom: 14
    },
    
    vietnam:{   
        id: 'vietnam',
        name: 'vietnam',
        bounds: {SW: [20.393639, 104.745454], NE: [22.249519, 106.644869]},
        countries: ['Russia', 'Vietnam', 'USA', 'UK', 'Germany'],
        units: {tank: 4, foot: 5, base: 2},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8012',
        year: 2013,
         minZoom: 12,
        maxZoom: 14
    },
    
    russia_hato:{   
        id: 'russia_hato',
        name: 'russia_hato',
        bounds: {SW: [55.061963, 36.367152], NE: [56.324190, 38.327810]},
        countries: ['Russia', 'Hato'],
        units: {tank: 20, foot: 20, base: 6},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8013',
        year: 2013,
         minZoom: 12,
        maxZoom: 14
    },
    
    novorossia:{   
        id: 'novorossia',
        name: 'novorossia',
        bounds: {SW: [46.885100, 36.472769], NE: [49.852250, 39.421360]},
        countries: ['Novorossia', 'Ukraine'],
        units: {tank: 20, foot: 20, base: 6},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8014',
        year: 2013,
         minZoom: 12,
        maxZoom: 14
    },
    
     usa_war:{   
        id: 'usa_war',
        name: 'usa_war',
        bounds: {SW: [29.458192, -103.897279], NE: [34.095732, -94.925399]},
        countries: ['USA', 'Confederation'],
        units: {foot: 20, base: 6},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8015',
        year: 2013,
         minZoom: 12,
        maxZoom: 14
    },

    invading_to_russia:{
        id: 'invading_to_russia',
        name: 'invading_to_russia',
        bounds: {SW: [44.826868, 28.222686], NE: [61.833239, 37.491232]},
        countries: ['NATO', 'Russia'],
        units: {foot: 20, base: 6},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8016',
        year: 2013,
        minZoom: 12,
        maxZoom: 14
    },

    mariel_defence:{
        id: 'mariel_defence',
        name: 'mariel_defence',
        bounds: {SW: [55.986931, 45.559630], NE: [57.404351, 50.105223]},
        countries: ['NATO', 'MariEl'],
        units: {foot: 20, base: 6},
        mission: 'miss_desc',
        geoserver: 'http://127.0.0.1:8016',
        year: 2013,
        minZoom: 12,
        maxZoom: 14
    }
};

exports.locations = Locations;