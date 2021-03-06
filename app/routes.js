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
    ],
    "batSpecies2": [
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
    ],
    "roostUses": [
        {
            "id": "_roostUse-1",
            "name": "Maternity"
        },
        {
            "id": "_roostUse-2",
            "name": "Hibernation"
        },
        {
            "id": "_roostUse-3",
            "name": "Minor"
        },
        {
            "id": "_roostUse-4",
            "name": "Day"
        },
        {
            "id": "_roostUse-5",
            "name": "Night"
        },
        {
            "id": "_roostUse-6",
            "name": "Feeding"
        },
        {
            "id": "_roostUse-7",
            "name": "Transitional/Occasional"
        },
        {
            "id": "_roostUse-8",
            "name": "Satellite"
        },
        {
            "id": "_roostUse-9",
            "name": "Swarming"
        },
        {
            "id": "_roostUse-10",
            "name": "Mating"
        }
    ],
    "roostUses2": [
        {
            "id": "_roostUse-1",
            "name": "Breeding (maternity)"
        },
        {
            "id": "_roostUse-2",
            "name": "Hibernation"
        },
        {
            "id": "_roostUse-3",
            "name": "Day"
        },
        {
            "id": "_roostUse-4",
            "name": "Night"
        },
        {
            "id": "_roostUse-5",
            "name": "Feeding"
        },
        {
            "id": "_roostUse-6",
            "name": "Transitional/Occasional"
        },
        {
            "id": "_roostUse-7",
            "name": "Satellite"
        },
        {
            "id": "_roostUse-8",
            "name": "Swarming"
        },
        {
            "id": "_roostUse-9",
            "name": "Mating"
        }
    ],
    "roostUses3": [
        {
            "id": "_roostUse-1",
            "name": "Maternity"
        },
        {
            "id": "_roostUse-2",
            "name": "Hibernation"
        },
        {
            "id": "_roostUse-3",
            "name": "Day"
        },
        {
            "id": "_roostUse-4",
            "name": "Night"
        },
        {
            "id": "_roostUse-5",
            "name": "Feeding"
        },
        {
            "id": "_roostUse-6",
            "name": "Transitional/Occasional"
        },
        {
            "id": "_roostUse-7",
            "name": "Satellite"
        },
        {
            "id": "_roostUse-8",
            "name": "Swarming"
        },
        {
            "id": "_roostUse-9",
            "name": "Mating"
        }
    ],
    "settUses": [
        {
            "id": "_settUse-1",
            "name": "Main"
        },
        {
            "id": "_settUse-2",
            "name": "Annexe"
        },
        {
            "id": "_settUse-3",
            "name": "Outlier"
        },
        {
            "id": "_settUse-4",
            "name": "Subsidiary"
        }
    ],
    "badgerActivities": [
        {
            "id": "_badgerActivity-1",
            "name": "Obstructing sett entrances by means of one-way badger gates"
        },
        {
            "id": "_badgerActivity-2",
            "name": "Obstructing access to sett entrances by blocking or proofing"
        },
        {
            "id": "_badgerActivity-3",
            "name": "Damaging a sett by hand and mechanical means"
        },
        {
            "id": "_badgerActivity-4",
            "name": "Destruction of the vacant sett by hand and mechanical means"
        },
        {
            "id": "_badgerActivity-5",
            "name": " Disturbance of badgers"
        }
    ],
    "batActivities": [
        {
            "id": "_batActivity-1",
            "name": "Capture by hand or using a net"
        },
        {
            "id": "_batActivity-2",
            "name": "Move them from the roost"
        },
        {
            "id": "_batActivity-3",
            "name": "Disturb with an endoscope"
        },
        {
            "id": "_batActivity-4",
            "name": "Temporarily stop the bats from entering the roost"
        },
        {
            "id": "_batActivity-5",
            "name": "Disturb with light"
        },
        {
            "id": "_batActivity-6",
            "name": "Disturb with noise or vibration"
        }
    ],
    "batActivities2": [
        {
            "id": "_batActivity-1",
            "name": "Capture by hand or using a net"
        },
        {
            "id": "_batActivity-2",
            "name": "Move them from the roost"
        },
        {
            "id": "_batActivity-3",
            "name": "Disturb with an endoscope"
        },
        {
            "id": "_batActivity-4",
            "name": "Temporarily block the roost"
        },
        {
            "id": "_batActivity-5",
            "name": "Disturb with light"
        },
        {
            "id": "_batActivity-6",
            "name": "Disturb with noise or vibration"
        }
    ],
    "batActivities3": [
        {
            "id": "_batActivity-1",
            "name": "Disturb with light"
        },
        {
            "id": "_batActivity-2",
            "name": "Disturb with noise or vibration"
        },
        {
            "id": "_batActivity-3",
            "name": "Disturb with an endoscope"
        },
        {
            "id": "_batActivity-4",
            "name": "Capture by hand or net"
        },
        {
            "id": "_batActivity-5",
            "name": "Move them from the roost"
        },
        {
            "id": "_batActivity-6",
            "name": "Temporarily block roost access"
        },
        {
            "id": "_batActivity-7",
            "name": "Permanently block roost access"
        },
        {
            "id": "_batActivity-8",
            "name": "Destroy their roost"
        }
    ],
    "roostActivities": [
        {
            "id": "_roostActivity-1",
            "name": "Destroy the roost",
            "methods-description": "How will your activity destroy the roost?",
            "methods": [
                {
                    "id": "_roostActivityMethod-1",
                    "name": "Permanently stop the bats from entering the roost"
                },
                {
                    "id": "_roostActivityMethod-2",
                    "name": "Take the roost apart by hand or with tools"
                },
                {
                    "id": "_roostActivityMethod-3",
                    "name": "Demolish the bat’s roosting place by machine"
                }
            ]
        },
        {
            "id": "_roostActivity-2",
            "name": "Damage the roost",
            "methods-description": "How will your activity damage the roost?",
            "methods": [
                {
                    "id": "_roostActivityMethod-1",
                    "name": "Permanently stop the bats from entering the roost"
                },
                {
                    "id": "_roostActivityMethod-2",
                    "name": "Take the roost apart by hand or with tools"
                },
                {
                    "id": "_roostActivityMethod-3",
                    "name": "Demolish the bat’s roosting place by machine"
                }
            ]
        },
        {
            "id": "_roostActivity-3",
            "name": "Neither"
        }
    ],
    "roostActivities2": [
        {
            "id": "_roostActivity-1",
            "name": "Destroy the roost",
            "methods-description": "How will the activity destroy this roost?",
            "methods": [
                {
                    "id": "_roostActivityMethod-1",
                    "name": "Permanently block the roost"
                },
                {
                    "id": "_roostActivityMethod-2",
                    "name": "Take the roost apart by hand or with tools"
                },
                {
                    "id": "_roostActivityMethod-3",
                    "name": "Demolish the roost by machine"
                }
            ]
        },
        {
            "id": "_roostActivity-2",
            "name": "Damage the roost",
            "methods-description": "How will the activity damage this roost?",
            "methods": [
                {
                    "id": "_roostActivityMethod-1",
                    "name": "Permanently block the roost"
                },
                {
                    "id": "_roostActivityMethod-2",
                    "name": "Take the roost apart by hand or with tools"
                },
                {
                    "id": "_roostActivityMethod-3",
                    "name": "Demolish the roost by machine"
                }
            ]
        },
        {
            "id": "_roostActivity-3",
            "name": "Neither"
        }
    ],
    "batApplicationReasons": [
        {
            "id": "_reasonBat-1",
            "name": "Imperative reasons of overriding public interest including those of a social or economic nature and beneficial consequences of primary importance for the environment"
        },
        {
            "id": "_reasonBat-2",
            "name": "Preserving public health or public safety"
        },
        {
            "id": "_reasonBat-3",
            "name": "Preventing serious damage to livestock, foodstuffs for livestock, crops, vegetables, fruit, growing timber, fisheries or inland waters, or any other form of property"
        },
        {
            "id": "_reasonBat-4",
            "name": "Preventing the spread of disease"
        },
        {
            "id": "_reasonBat-5",
            "name": "Other"
        }
    ],
    "newtActivities": [
        {
            "id": "_newtActivity-1",
            "name": "Disturb by search using a torch"
        },
        {
            "id": "_newtActivity-2",
            "name": "Capture by hand, trap or net"
        },
        {
            "id": "_newtActivity-3",
            "name": "Capture by refugia"
        },
        {
            "id": "_newtActivity-4",
            "name": "Move them"
        },
        {
            "id": "_newtActivity-5",
            "name": "Temporarily block access to their resting place"
        },
        {
            "id": "_newtActivity-6",
            "name": "Permanently block access to their resting place"
        },
        {
            "id": "_newtActivity-7",
            "name": "Drain their ponds"
        },
        {
            "id": "_newtActivity-8",
            "name": "Drift fencing"
        },
        {
            "id": "_newtActivity-9",
            "name": "Destructive search"
        }
    ],
    "workCategories": [
        {
            "id": "_categoryWork-1",
            "name": "Agriculture / Farming / Fishing / Forestry / Nature Conservation"
        },
        {
            "id": "_categoryWork-2",
            "name": "Archaeological investigation"
        },
        {
            "id": "_categoryWork-3",
            "name": "Barn conversion"
        },
        {
            "id": "_categoryWork-4",
            "name": "Commercial"
        },
        {
            "id": "_categoryWork-5",
            "name": "Communications"
        },
        {
            "id": "_categoryWork-6",
            "name": "Energy generation / Energy supply"
        },
        {
            "id": "_categoryWork-7",
            "name": "Flood and coastal defences"
        },
        {
            "id": "_categoryWork-8",
            "name": "Health & safety"
        },
        {
            "id": "_categoryWork-9",
            "name": "Heritage / Historical"
        },
        {
            "id": "_categoryWork-10",
            "name": "Householder home improvements"
        },
        {
            "id": "_categoryWork-11",
            "name": "Housing (non-householder)"
        },
        {
            "id": "_categoryWork-12",
            "name": "Industrial / Manufacturing"
        },
        {
            "id": "_categoryWork-13",
            "name": "Mineral extraction / Quarrying"
        },
        {
            "id": "_categoryWork-14",
            "name": "Nationally Significant Infrastructure Projects"
        },
        {
            "id": "_categoryWork-15",
            "name": "Places of worship"
        },
        {
            "id": "_categoryWork-16",
            "name": "Public buildings and land"
        },
        {
            "id": "_categoryWork-17",
            "name": "Tourism / Leisure"
        },
        {
            "id": "_categoryWork-18",
            "name": "Transport / Highways"
        },
        {
            "id": "_categoryWork-19",
            "name": "Waste management"
        },
        {
            "id": "_categoryWork-20",
            "name": "Water supply and treatment / water environment"
        }
    ],
    "consentTypes": [
        {
            "id": "_consentType-1",
            "name": "Planning permission"
        },
        {
            "id": "_consentType-2",
            "name": "Demolition consent"
        },
        {
            "id": "_consentType-3",
            "name": "Listed building consent"
        },
        {
            "id": "_consentType-4",
            "name": "Highways Act consent"
        },
        {
            "id": "_consentType-5",
            "name": "Mineral consent"
        },
        {
            "id": "_consentType-6",
            "name": "Conservation area consent"
        },
        {
            "id": "_consentType-7",
            "name": "Tree preservation order"
        },
        {
            "id": "_consentType-8",
            "name": "Utilities consent"
        },
    ],
    "applications": [
        {
            "id": 1,
            "roosts": [],
            "consents": []
        }
    ],
    "memberships": [
        {
            "id": "_membership-1",
            "name": "Royal Town Planning Institute",
            "acronym": "TPI"
        },
        {
            "id": "_membership-2",
            "name": "Central Association for Agricultural Values",
            "acronym": "CAAV"
        },
        {
            "id": "_membership-3",
            "name": "Institute of Chartered Foresters",
            "acronym": "ICF"
        },
        {
            "id": "_membership-4",
            "name": "Chartered Institute for Ecology and Environmental Management",
            "acronym": "CIEEM"
        },
        {
            "id": "_membership-5",
            "name": "Institute of Environmental Management and Assessment",
            "acronym": "IEMA"
        },
        {
            "id": "_membership-6",
            "name": "Institution of Environmental Sciences",
            "acronym": "IES"
        },
        {
            "id": "_membership-7",
            "name": "Chartered Institute of Water and Environmental Management",
            "acronym": "CIWEM"
        },
        {
            "id": "_membership-8",
            "name": "College of Insurance and Financial Management",
            "acronym": "CIFM"
        },
        {
            "id": "_membership-9",
            "name": "Institute of Professional Soil Scientists",
            "acronym": "IPSS"
        },
        {
            "id": "_membership-10",
            "name": "Institute of Agricultural Management",
            "acronym": "IAgrM"
        },
        {
            "id": "_membership-11",
            "name": "Royal Institution of Chartered Surveyors",
            "acronym": "RICS"
        }
    ]
}


//For v1
var _batActivities = [
    {
        "id": "_activity-1",
        "name": "Capture",
        "methodsMapping": ["_method-1", "_method-2"]
    },
    {
        "id": "_activity-2",
        "name": "Disturb",
        "methodsMapping": ["_method-1", "_method-2", "_method-3", "_method-4", "_method-5", "_method-6", "_method-7", "_method-8", "_method-9", "_method-10"]
    },
    {
        "id": "_activity-3",
        "name": "Transport",
        "methodsMapping": ["_method-1"]
    },
    {
        "id": "_activity-4",
        "name": "Damage breeding site",
        "methodsMapping": ["_method-4","_method-5","_method-6","_method-7", "_method-8"]
    },
    {
        "id": "_activity-5",
        "name": "Destroy breeding site",
        "methodsMapping": ["_method-4","_method-5","_method-6"]
    },
    {
        "id": "_activity-6",
        "name": "Damage resting place",
        "methodsMapping": ["_method-4","_method-5","_method-6","_method-7", "_method-8"]
    },
    {
        "id": "_activity-7",
        "name": "Destroy resting place",
        "methodsMapping": ["_method-4","_method-5","_method-6"]
    }
]
var _batMethods = [
    {
        "id": "_method-1",
        "name": "By hand"
    },
    {
        "id": "_method-2",
        "name": "By static hand-held net"
    },
    {
        "id": "_method-3",
        "name": "Temporary exclusion"
    },
    {
        "id": "_method-4",
        "name": "Permanent exclusion"
    },
    {
        "id": "_method-5",
        "name": "Destructive search by soft demolition"
    },
    {
        "id": "_method-6",
        "name": "Mechanical demolition"
    },
    {
        "id": "_method-7",
        "name": "Disturbance by illumination (intentional by torch)"
    },
    {
        "id": "_method-8",
        "name": "Disturbance by noise or vibration"
    },
    {
        "id": "_method-9",
        "name": "Temporary obstruction of roost access"
    },
    {
        "id": "_method-10",
        "name": "Endoscopes"
    }
]
_myData.batSpecies.forEach(function(_bat, index) {

    //Set Activities
    _bat.activities = _batActivities

    //Set Methods on activities
    _bat.activities.forEach(function(_activity, index) {
        _activity.methods = []
        _batMethods.forEach(function(_method, index) {
            if(_activity.methodsMapping.indexOf(_method.id.toString()) != -1){
                _activity.methods.push(_method)
            }
        });
        // _activity.methods = _batMethods
    });

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
_myData.batSpecies2.sort(function(a,b){
    if (a.name.toUpperCase() < b.name.toUpperCase()){
        return -1
    } else if(a.name.toUpperCase() > b.name.toUpperCase()){
        return 1
    }
    return 0;
});

//Sort categories
_myData.workCategories.sort(function(a,b){
    if (a.name.toUpperCase() < b.name.toUpperCase()){
        return -1
    } else if(a.name.toUpperCase() > b.name.toUpperCase()){
        return 1
    }
    return 0;
});

//Sort memberships
_myData.memberships.sort(function(a,b){
    if (a.name.toUpperCase() < b.name.toUpperCase()){
        return -1
    } else if(a.name.toUpperCase() > b.name.toUpperCase()){
        return 1
    }
    return 0;
});

require('./routes/1-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/2-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/3-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/4-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/5-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/6-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/7-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/8-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));
require('./routes/9-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));

module.exports = router
