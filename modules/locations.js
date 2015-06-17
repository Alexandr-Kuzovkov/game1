var Locations = {

    location1: {   
        id: 'location1',
        name: 'Ирак',
        bounds: {SW: [32.5, 43.5], NE: [33.9, 45]},
        countries: ['russia', 'us', 'uk', 'germany', 'iraq'],
        units: {tank: 4, foot: 5, base: 2}
    },
    
    location2: {   
        id: 'location2',
        name: 'Сирия',
        bounds: {SW: [33.189267, 36.000493], NE: [33.659194, 36.593755]},
        countries: ['russia', 'us', 'uk', 'germany','syria'],
        units: {tank: 4, foot: 5, base: 2}
    },
    
    location3:{   
        id: 'location3',
        name: 'Украина',
        bounds: {SW: [47.718398, 37.421492], NE: [48.088488, 37.948836]},
        countries: ['russia', 'ukraine', 'us', 'uk', 'germany'],
        units: {tank: 4, foot: 5, base: 2}
    }





};

exports.locations = Locations;