const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// Base session data
var _myData = {
    "includeValidation": "true",
    "batSpecies": [
        {
            "id": "_bat-1",
            "name": "Alcathoe"
        },
        {
            "id": "_bat-2",
            "name": "Nathusius’ pipistrelle"
        },
        {
            "id": "_bat-3",
            "name": "Barbastelle"
        },
        {
            "id": "_bat-4",
            "name": "Natterer’s"
        },
        {
            "id": "_bat-5",
            "name": "Bechstein’s"
        },
        {
            "id": "_bat-6",
            "name": "Greater horseshoe"
        },
        {
            "id": "_bat-7",
            "name": "Noctule"
        },
        {
            "id": "_bat-8",
            "name": "Brandt’s"
        },
        {
            "id": "_bat-9",
            "name": "Serotine"
        },
        {
            "id": "_bat-10",
            "name": "Brown long-eared"
        },
        {
            "id": "_bat-11",
            "name": "Grey long-eared"
        },
        {
            "id": "_bat-12",
            "name": "Soprano pipistrelle"
        },
        {
            "id": "_bat-13",
            "name": "Common pipistrelle"
        },
        {
            "id": "_bat-14",
            "name": "Leisler’s"
        },
        {
            "id": "_bat-15",
            "name": "Whiskered"
        },
        {
            "id": "_bat-16",
            "name": "Daubenton’s"
        },
        {
            "id": "_bat-17",
            "name": "Lesser horseshoe"
        }
    ]
}

// Set activities list on each bat species
var _batActivities = [
    {
        "id": "_activity-1",
        "name": "Capture"
    },
    {
        "id": "_activity-2",
        "name": "Disturb"
    },
    {
        "id": "_activity-3",
        "name": "Transport"
    },
    {
        "id": "_activity-4",
        "name": "Damage breeding site"
    },
    {
        "id": "_activity-5",
        "name": "Destroy breeding site"
    },
    {
        "id": "_activity-6",
        "name": "Damage resting place"
    },
    {
        "id": "_activity-7",
        "name": "Destroy resting place"
    }
]
_myData.batSpecies.forEach(function(_bat, index) {
    _bat.activities = _batActivities
});

//Sort bats
_myData.batSpecies.sort(function(a,b){
    if (a.name.toUpperCase() < b.name.toUpperCase()){
        return -1
    } else if(a.name.toUpperCase() > b.name.toUpperCase()){
        return 1
    }
    return 0;
});

require('./routes/1-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));

module.exports = router
