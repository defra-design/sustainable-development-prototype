const e = require("express");

module.exports = function (router,_myData) {

    var version = "7-0";

    function setServiceName(req){
        req.session.myData.serviceName = "Apply for a licence to do work that affects a protected species"
        //Service name
        // switch(req.session.myData.selectedApplication.type) {
        //     case "a14":
        //         req.session.myData.serviceName = "Apply for a licence to do work that will affect great crested newts"
        //         break;
        //     case "a13":
        //         req.session.myData.serviceName = "Apply for a licence to do work that will affect bats"
        //         break;
        //     default:
        //         req.session.myData.serviceName = "Apply for a licence to do work that will affect bats"
        // }
    }

    function addApplicationToSavedApplications(req,_application){
        _application.new = false
        _application.status = "inprogress"

        var _existingApplication = req.session.myData.applications.find(obj => {return obj.id.toString() === _application.id.toString()});
                    
        if(_existingApplication){
            //replace existing
            var _existingIndex = req.session.myData.applications.map(item => item.id.toString()).indexOf(_application.id.toString());
            req.session.myData.applications[_existingIndex] = _application;
        } else {
            // add new
            req.session.myData.applications.push(_application)
        }
    }

    function addHabitatToApplication(req,habitat){
        habitat.new = false
        habitat.inprogress = false

        var _existingHabitat = req.session.myData.selectedApplication.habitats.find(obj => {return obj.id.toString() === habitat.id.toString()});
                    
        if(_existingHabitat){
            //replace existing
            var _existingIndex = req.session.myData.selectedApplication.habitats.map(item => item.id.toString()).indexOf(habitat.id.toString());
            req.session.myData.selectedApplication.habitats[_existingIndex] = habitat;
        } else {
            // add new
            req.session.myData.selectedApplication.habitats.push(habitat)
        }
    }

    function addConsentToApplication(req,consent){
        consent.new = false
        consent.inprogress = false

        var _existingConsent = req.session.myData.selectedApplication.consents.find(obj => {return obj.id.toString() === consent.id.toString()});
                    
        if(_existingConsent){
            //replace existing
            var _existingIndex = req.session.myData.selectedApplication.consents.map(item => item.id.toString()).indexOf(consent.id.toString());
            req.session.myData.selectedApplication.consents[_existingIndex] = consent;
        } else {
            // add new
            req.session.myData.selectedApplication.consents.push(consent)
        }
    }

    function setSelectedApplication(req, _applicationID){

        // console.log("entered setSelectedApplication")

        if(_applicationID){
            var _existingApplication = req.session.myData.applications.find(obj => {return obj.id.toString() === _applicationID.toString()})
            if(_existingApplication){
                //Use existing application
                req.session.myData.selectedApplication = _existingApplication
            } else {
                //Set as new application
                req.session.myData.selectedApplication = req.session.myData.tempApplication
            }
            req.session.myData.application = req.session.myData.selectedApplication.id
            // console.log("application = " + req.session.myData.application)
        }

        setServiceName(req)

    }

    function setSelectedHabitat(req, _habitatID){

        if(_habitatID){

            var _existingHabitat = req.session.myData.selectedApplication.habitats.find(obj => {return obj.id.toString() === _habitatID.toString()})

            //TODO fix it not thinking the currently added new one is existing

            if(_existingHabitat){
                req.session.myData.selectedHabitat = _existingHabitat
            } else {
                if(req.session.myData.testdata == "true"){

                    var _testHabitatToUse = req.session.myData.testRoost
                    if(req.session.myData.selectedApplication.type == "a24"){
                        _testHabitatToUse = req.session.myData.testSett
                    }
                    req.session.myData.selectedHabitat = _testHabitatToUse

                    addHabitatToApplication(req,req.session.myData.selectedHabitat)
                } else {
                    if(!req.session.myData.newHabitat.inprogress){
                        req.session.myData.newHabitat.inprogress = true
                        req.session.myData.selectedHabitat = req.session.myData.newHabitat
                    }
                }
            }
            req.session.myData.habitat = req.session.myData.selectedHabitat.id
            
        }
    }

    function startNewHabitat(req){
        var _randomID = Math.floor(100000 + Math.random() * 900000)
        req.session.myData.newHabitat.id = _randomID
        req.session.myData.newHabitat.inprogress = false
        setSelectedHabitat(req, _randomID)
    }

    function setSelectedConsent(req, _consentID){

        if(_consentID){

            var _existingConsent = req.session.myData.selectedApplication.consents.find(obj => {return obj.id.toString() === _consentID.toString()})

            //TODO fix it not thinking the currently added new one is existing

            if(_existingConsent){
                req.session.myData.selectedConsent = _existingConsent
            } else {
                if(req.session.myData.testdata == "true"){
                    req.session.myData.selectedConsent = req.session.myData.testConsent
                    addConsentToApplication(req,req.session.myData.selectedConsent)
                } else {
                    if(!req.session.myData.newConsent.inprogress){
                        req.session.myData.newConsent.inprogress = true
                        req.session.myData.selectedConsent = req.session.myData.newConsent
                    }
                }
            }
            req.session.myData.consent = req.session.myData.selectedConsent.id
            
        }
    }

    function startNewConsent(req){
        var _randomID = Math.floor(100000 + Math.random() * 900000)
        req.session.myData.newConsent.id = _randomID
        req.session.myData.newConsent.inprogress = false
        setSelectedConsent(req, _randomID)
    }

    function updateTasklist(req,_application){ 

        var _thisApplication = req.session.myData.selectedApplication
        if(_application){
            _thisApplication = _application
        }

        //Total sections
        var _totalSections = Object.keys(_thisApplication.tasklist.sections).length
        _thisApplication.tasklist.total = _totalSections
        if(_thisApplication.consent == "No"){
            --_thisApplication.tasklist.total
        }
        // if(_thisApplication.type == "a24"){
        //     --_thisApplication.tasklist.total
        // }

        var cansubmit = true,
            canstart = true

        // Counts
        _thisApplication.tasklist.completed = 0
        for (const [key, value] of Object.entries(_thisApplication.tasklist.sections)) {
            if(value == "completed"){
                _thisApplication.tasklist.completed++
            } else {
                //Set if can send application yet
                if(key == "7"){
                    canstart = false
                }
                //Sections required
                var _sectionsRequired = ["1","2","4","5","6","7","8","9"]
                if(_thisApplication.consent == "No"){
                    _sectionsRequired = ["1","2","4","5","6","7","9"]
                }
                // Remove section 2 if badger
                // if(_thisApplication.type == "a24"){
                //     _sectionsRequired.splice(_sectionsRequired.indexOf("2"), 1);
                // }

                for (var i = 0; i < _sectionsRequired.length; i++) {
                    if(_sectionsRequired[i] == key){
                        cansubmit = false
                    }
                }
            }
        }

        //Set submit to "notstarted" if all others completed
        if(cansubmit && _thisApplication.tasklist.sections["3"] == "cannotstartyet"){
            _thisApplication.tasklist.sections["3"] = "notstarted"
        }

        //Set others to "notstarted" if permission completed
        if(canstart){
            if(_thisApplication.tasklist.sections["1"] == "cannotstartyet"){
                _thisApplication.tasklist.sections["1"] = "notstarted"
            }
            if(_thisApplication.tasklist.sections["2"] == "cannotstartyet"){
                _thisApplication.tasklist.sections["2"] = "notstarted"
            }
            if(_thisApplication.tasklist.sections["4"] == "cannotstartyet"){
                _thisApplication.tasklist.sections["4"] = "notstarted"
            }
            if(_thisApplication.tasklist.sections["5"] == "cannotstartyet"){
                _thisApplication.tasklist.sections["5"] = "notstarted"
            }
            if(_thisApplication.tasklist.sections["6"] == "cannotstartyet"){
                _thisApplication.tasklist.sections["6"] = "notstarted"
            }
            if(_thisApplication.tasklist.sections["8"] == "cannotstartyet"){
                _thisApplication.tasklist.sections["8"] = "notstarted"
            }
            if(_thisApplication.tasklist.sections["9"] == "cannotstartyet"){
                _thisApplication.tasklist.sections["9"] = "notstarted"
            }
        }

    }

    function updateLastSavedDate(req,_application){
        _application.lastsaveddate = new Date()
    }

    function setFriendlyDates(req){
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        req.session.myData.applications.forEach(function(_application, index) {
            //Started date
            var _started = new Date(_application.starteddate)
            _application.starteddatefriendly = _started.getDate() + " " + months[_started.getMonth()] + " " + _started.getFullYear()

            //Last saved date
            var _lastsaved = new Date(_application.lastsaveddate)
            _application.lastsaveddatefriendly = _lastsaved.getDate() + " " + months[_lastsaved.getMonth()] + " " + _lastsaved.getFullYear()

            //valid from
            var _validFrom = new Date(_application.validfromdate)
            _application.validfromdatefriendly = _validFrom.getDate() + " " + months[_validFrom.getMonth()] + " " + _validFrom.getFullYear()

             //valid to
             var _validTo = new Date(_application.validtodate)
             _application.validtodatefriendly = _validTo.getDate() + " " + months[_validTo.getMonth()] + " " + _validTo.getFullYear()
        });
    }
    

    function reset(req){
        // console.log("entered reset")
        req.session.myData = JSON.parse(JSON.stringify(_myData))

        // Tasklist
        // 1 = purpose
        // 2 = application details
        // 3 = send
        // 4 = site
        // 5 = applicant
        // 6 = ecologist
        // 7 = permission (eligibility)
        // 8 = permissions data
        // 9 = work schedule
        req.session.myData.tasklist = {
            "sections": {
                "1": "cannotstartyet",
                "2": "cannotstartyet",
                "3": "cannotstartyet",
                "4": "cannotstartyet",
                "5": "cannotstartyet",
                "6": "cannotstartyet",
                "7": "notstarted",
                "8": "cannotstartyet",
                "9": "cannotstartyet"
            },
            "completed": 0,
            "total": 0
        }

        req.session.myData.applications = [
            {
                "id": "2021-12345-EPS-MIT", 
                "type": "a13",
                "habitatType": "multple",
                "new": false,
                "status": "inprogress",
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "habitats": [], 
                "consents": [], 
                "starteddate": new Date(2021, 10, 06, 16, 20, 0, 0),
                "lastsaveddate": new Date(2021, 10, 06, 17, 01, 30, 0),
                // 7 complete
                "landOwner": "Yes", 
                "landOwnerPermission": "", 
                "consent": "Yes", 
                "consentGranted": "Yes"
            },
            {
                "id": "2021-73955-EPS-MIT", 
                "type": "a14", 
                "new": false, 
                "status": "inprogress", 
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "habitats": [], 
                "consents": [], 
                "starteddate": new Date(2021, 10, 07, 16, 20, 0, 0),
                "lastsaveddate": new Date(2021, 10, 07, 17, 01, 30, 0),
                // 4 inprogress
                "siteName": "12 Parkland Avenue",
                // 7 complete
                "landOwner": "Yes", 
                "landOwnerPermission": "", 
                "consent": "Yes", 
                "consentGranted": "Yes",
                // 5 complete
                "applicantName": "John Smith", 
                "applicantHasCompany": "No", 
                "applicantCompany": "", 
                "applicantEmail": "jsmith37@gmail.com", 
                "applicantAddress": "2 High Street", 
                "applicantAddress1": "2 High Street", 
                "applicantAddress2": "", 
                "applicantAddress3": "Oxford", 
                "applicantAddress4": "Oxfordshire", 
                "applicantPostcode": "B1 1AA", 
                "applicantHasPostcode": "true",
                // 6 complete
                "ecologistName": "Margaret Rice", 
                "ecologistHasCompany": "No", 
                "ecologistCompany": "", 
                "ecologistEmail": "contact@riceltd.co.uk", 
                "ecologistAddress": "9 High Street", 
                "ecologistAddress1": "9 High Street", 
                "ecologistAddress2": "", 
                "ecologistAddress3": "Oxford", 
                "ecologistAddress4": "Oxfordshire", 
                "ecologistPostcode": "OX1 1AA", 
                "ecologistHasPostcode": "true"
            },
            {
                "id": "2021-98765-EPS-MIT",
                "type": "a14",
                "new": false,
                "status": "submitted",
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "habitats": [],
                "consents": [],
                "starteddate": new Date(2021, 10, 03, 11, 05, 0, 0),
                "lastsaveddate": new Date(2021, 10, 10, 16, 47, 40, 0),
                "siteName": "Smiths Farmyard",
                "applicantName": "John Smith",
                "hasPostcode": "Yes", 
                "sitePostcode": "B1 3AA", 
                "siteAddress": "5 High Street"
            },
            {
                "id": "2021-45678-EPS-MIT",
                "type": "a13",
                "habitatType": "multple",
                "new": false,
                "status": "submitted",
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "habitats": [],
                "consents": [],
                "starteddate": new Date(2021, 09, 12, 11, 05, 0, 0),
                "lastsaveddate": new Date(2021, 09, 17, 16, 47, 40, 0),
                "siteName": "20 High Street, Oxford",
                "applicantName": "Jane Doe",
                "hasPostcode": "Yes", 
                "sitePostcode": "B1 3AA", 
                "siteAddress": "20 High Street"
            },
            {
                "id": "2021-83653-EPS-MIT",
                "type": "a13",
                "habitatType": "multple",
                "new": false,
                "status": "granted",
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "habitats": [],
                "consents": [],
                "starteddate": new Date(2021, 09, 2, 10, 05, 0, 0),
                "lastsaveddate": new Date(2021, 09, 5, 16, 47, 40, 0),
                "validfromdate": new Date(2021, 09, 20, 16, 47, 40, 0),
                "validtodate": new Date(2022, 09, 20, 16, 47, 40, 0),
                "siteName": "Tomkins Estate",
                "applicantName": "John Smith",
                "hasPostcode": "Yes", 
                "sitePostcode": "B1 3AA", 
                "siteAddress": "5 High Street"
            },
            {
                "id": "2021-09273-EPS-MIT",
                "type": "a14",
                "new": false,
                "status": "granted",
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "habitats": [],
                "consents": [],
                "starteddate": new Date(2021, 08, 26, 10, 05, 0, 0),
                "lastsaveddate": new Date(2021, 09, 2, 16, 47, 40, 0),
                "validfromdate": new Date(2021, 10, 01, 16, 47, 40, 0),
                "validtodate": new Date(2024, 10, 01, 16, 47, 40, 0),
                "siteName": "90 Lower Eastside Farm",
                "applicantName": "Jane Doe",
                "hasPostcode": "Yes", 
                "sitePostcode": "B1 3AA", 
                "siteAddress": "5 High Street"
            }
        ]
        req.session.myData.user = {
            "userName": "David Smith",
            "userAddress1": "1 London Road",
            "userAddress2": "Moseley",
            "userAddress3": "Birmingham",
            "userAddress4": "West Midlands",
            "userPostcode": "B32 1AP",
            "companies": [
                //For each additional company name added against this user
                {
                    "company": "Eco Solutions Limited"
                }
            ],
            "emails": [
                //For each additional email added against this user
                {
                    "email": "d_smith@gmail.com"
                },
                {
                    "email": "info@ecosolutions.com"
                }
            ],
            "addresses": [
                //For each additional address added against this user
                {
                    "address1": "1 London Road",
                    "address2": "Moseley",
                    "address3": "Birmingham",
                    "address4": "West Midlands",
                    "postcode": "B32 1AP",
                }
            ]
        }

        // ECOLOGISTS
        req.session.myData.ecologists = [
            {
                "name": "Margaret Rice",
                "companies": [
                    {
                        "company": "Rice Ltd"
                    }
                ],
                "emails": [
                    //For each additional email added against this user
                    {
                        "email": "marrice@outlook.com"
                    },
                    {
                        "email": "contact@riceltd.co.uk"
                    }
                ],
                "addresses": [
                    {
                        "address1": "9 High Street",
                        "address2": "",
                        "address3": "Oxford",
                        "address4": "Oxfordshire",
                        "postcode": "OX1 1AA",
                    }
                ]
            }
        ]
        // APPLICANTS
        req.session.myData.applicants = [
            {
                "name": "Jane Doe",
                "companies": [
                    {
                        "company": "20 Capital Ltd"
                    }
                ],
                "emails": [
                    //For each additional email added against this user
                    {
                        "email": "jane_doe@outlook.com"
                    },
                    {
                        "email": "customercare@20capital.co.uk"
                    }
                ],
                "addresses": [
                    {
                        "address1": "20 High Street",
                        "address2": "",
                        "address3": "Oxford",
                        "address4": "Oxfordshire",
                        "postcode": "B1 3AA",
                    }
                ]
            },
            {
                "name": "John Smith",
                "companies": [
                    {
                        "company": "Smith Developments Limited"
                    }
                ],
                "emails": [
                    //For each additional email added against this user
                    {
                        "email": "jsmith37@gmail.com"
                    }
                ],
                "addresses": [
                    {
                        "address1": "2 High Street",
                        "address2": "",
                        "address3": "Oxford",
                        "address4": "Oxfordshire",
                        "postcode": "B1 1AA",
                    }
                ]
            }
        ]

        //Preset answers
        req.session.myData.applications[0].tasklist.sections["7"] = "completed"
        req.session.myData.applications[1].tasklist.sections["4"] = "inprogress"
        req.session.myData.applications[1].tasklist.sections["5"] = "completed"
        req.session.myData.applications[1].tasklist.sections["6"] = "completed"
        req.session.myData.applications[1].tasklist.sections["7"] = "completed"
        req.session.myData.applications.forEach(function(_application, index) {
            //Submitted ones
            if(_application.status == "submitted" || _application.status == "granted"){
                for (const [key, value] of Object.entries(_application.tasklist.sections)) {
                    _application.tasklist.sections[key] = "completed"
                }
            }
            //All
            updateTasklist(req,_application)
        });

        //Default required questions (purpose flow)
        req.session.myData.requiredQuestions = {
            "CD16": true, //CD16. Work reason
            "CD22": true, //CD22. Work small developments
            "CD24": true, //CD24. Work public buildings (also includes CD25 & CD26)
            "CD27": true  //CD27. Important populations
        }
        
        // Default setup
        req.session.myData.service = "apply"
        req.session.myData.licenceType = "a13"
        req.session.myData.habitatToRemove = "123456789"
        req.session.myData.signedIn = "false"

        //Default answers
        req.session.myData.application = "2021-12345-EPS-MIT"
        // console.log("application = " + req.session.myData.application)

        req.session.myData.newApplication = 
            {
                "id": Math.floor(100000 + Math.random() * 900000),
                "type": req.session.myData.licenceType,
                "habitatType": "multple",
                "new": true,
                "status": "notstarted",
                "starteddate": new Date(),
                "lastsaveddate": new Date(),
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "habitats": [],
                "consents": []
            }

        req.session.myData.habitat = Math.floor(100000 + Math.random() * 900000)
        req.session.myData.newHabitat = {"id": req.session.myData.habitat,"new":true, "inprogress": false}

        req.session.myData.consent = Math.floor(100000 + Math.random() * 900000)
        req.session.myData.newConsent = {"id": req.session.myData.consent,"type":{},"new":true, "inprogress": false}

        //Set test habitat (just for deep links to work) - in pages if testdata == true, we will use a testHabitat
        req.session.myData.testdata = 'false'
        req.session.myData.testRoost = {
            "id": 123456789,
            "speciesID": req.session.myData.batSpecies2[0].id,
            "speciesName": req.session.myData.batSpecies2[0].name,
            "numberUsing": "5",
            "habitatUses": [
                JSON.parse(JSON.stringify(req.session.myData.roostUses3[0]))
            ],
            "activities": [
                JSON.parse(JSON.stringify(req.session.myData.batActivities3[0])),
                JSON.parse(JSON.stringify(req.session.myData.batActivities3[1]))
            ],
            "new": false,
            "inprogress": false
        }
        req.session.myData.testSett = {
            "id": 123456789,
            "habitatUses": [
                JSON.parse(JSON.stringify(req.session.myData.settUses[0]))
            ],
            "habitatActive": "Yes",
            "habitatReopen": "Yes",
            "entranceHoles": "1",
            "activities": [
                JSON.parse(JSON.stringify(req.session.myData.badgerActivities[0])),
                JSON.parse(JSON.stringify(req.session.myData.badgerActivities[1]))
            ],
            "new": false,
            "inprogress": false
        }
        //Set test consent (just for deep links to work) - in pages if testdata == true, we will use the testConsent
        req.session.myData.testdata = 'false'
        req.session.myData.testConsent = {
            "id": 123456789,
            "type": 
            {
                "id": req.session.myData.consentTypes[0].id,
                "name": req.session.myData.consentTypes[0].name
            },
            "consentReference": "123/45678/9A",
            "new": false,
            "inprogress": false
        }


    }

    // Every GET and POST
    router.all('/' + version + '/*', function (req, res, next) {
        // console.log("entered all *")

        // console.log(req.session.myData)
        // console.log("------------------")
        // console.log("------------------")
        // console.log("------------------")
        if(!req.session.myData || req.query.r) {
            reset(req)
        }

        //Local or live
        // req.session.myData.local = req.headers.origin == 'http://localhost:3000'

        //version
        req.session.myData.version = version

        // Reset page validation to false by default. Will only be set to true, if applicable, on a POST of a page
        req.session.myData.validationErrors = {}
        req.session.myData.validationError = "false"
        req.session.myData.includeValidation =  req.query.iv || req.session.myData.includeValidation

        //Reset page notifications
        req.session.myData.notifications = {}
        req.session.myData.showNotification = "false"

        //defaults for setup
        // req.session.myData.example =  req.query.eg || req.session.myData.example
        
        //Constant checks for query
        req.session.myData.testdata = req.query.testdata || req.session.myData.testdata

        //Selected application
        req.session.myData.application = req.query.application || req.session.myData.application
        // console.log("application = " + req.session.myData.application)
        setSelectedApplication(req,req.session.myData.application)

        //Selected habitat
        req.session.myData.habitat = req.query.habitat || req.session.myData.habitat
        setSelectedHabitat(req,req.session.myData.habitat)

        //Selected consent
        req.session.myData.consent = req.query.consent || req.session.myData.consent
        setSelectedConsent(req,req.session.myData.consent)

        //Site map filter
        req.session.myData.findlocation = req.query.findlocation || req.session.myData.findlocation

        //Licence type
        req.session.myData.licenceType =  req.query.l || req.session.myData.licenceType

        //Signed in
        req.session.myData.signedIn =  req.query.si || req.session.myData.signedIn

        //Dev notes
        req.session.myData.showDevNotes =  req.query.dev || req.session.myData.showDevNotes

        //Default required questions (purpose flow)
        var _l = req.session.myData.licenceType
        req.session.myData.requiredQuestions = {
            "CD16": _l == "a13" || _l == "a14", //CD16. Work reason
            "CD22": _l == "a13" || _l == "a14", //CD22. Work small developments
            "CD24": _l == "a13" || _l == "a14", //CD24. Work public buildings (also includes CD25 & CD26)
            "CD27": _l == "a13" || _l == "a14"  //CD27. Important populations
        }

        //Update tasklist data
        updateTasklist(req)

        //Set friendly dates
        setFriendlyDates(req)

        //Set service name
        setServiceName(req)

        //Start new application
        if(req.query.new){

            //Reference number
            var _year = new Date().getFullYear(),
                _randomID = Math.floor(10000 + Math.random() * 90000),
                _suffix = "-EPS-MIT"
            if(req.session.myData.licenceType == "a24"){
                _suffix = "-SPM-WLM"
            }
            var _appID = _year + "-" + _randomID + _suffix

            //Habitat type (checkboxes or radios)
            var _habitatType = "multiple"
            if(req.session.myData.licenceType == "a24"){
                _habitatType = "single"
            }

            //Used until passes eligibility
            req.session.myData.tempApplication = JSON.parse(JSON.stringify(req.session.myData.newApplication))
            req.session.myData.tempApplication.id = _appID
            req.session.myData.tempApplication.status = "inprogress"
            req.session.myData.tempApplication.type = req.session.myData.licenceType
            req.session.myData.tempApplication.habitatType = _habitatType
            req.session.myData.tempApplication.starteddate = new Date()
            req.session.myData.tempApplication.lastsaveddate = new Date()
            
            req.session.myData.selectedApplication = req.session.myData.tempApplication
            req.session.myData.application = _appID
            // console.log("application = " + req.session.myData.application)

            setServiceName(req)
            updateTasklist(req)
        }

        // FOR when returning from Defra ID
        var _fileName = res.req.params[0]
        if(_fileName.startsWith("defraid")){
            req.session.myData.signedIn = "true"
            var _redirectTo = _fileName.split('-')[1];
            res.redirect(301, '/' + version + '/' + _redirectTo);
        } else {
            next()
        }

    });

    // Prototype setup
    router.get('/' + version + '/setup', function (req, res) {
        res.render(version + '/setup', {
            myData:req.session.myData
        });
    });

    // Show test data
    router.get('/' + version + '/_testData', function (req, res) {
        res.render(version + '/_testData', {
            myData:req.session.myData
        });
    });

    // To handle returns from Defra ID
    // router.get('/' + version + '/*', function (req, res, next) {
        
    //     var _fileName = res.req.params[0]

    //     if(_fileName.startsWith("defraid")){
    //         req.session.myData.signedIn = "true"
    //         var _redirectTo = _fileName.split('-')[1];
    //         res.redirect(301, '/' + version + '/' + _redirectTo);
    //     } else {
    //         next()
    //     }

    // });


    // Defra ID signin
    router.get('/' + version + '/defra-id-signin', function (req, res, next) {
        req.session.myData.returnURL = req.query.returnURL || "tasklist"
        res.render(version + '/defra-id-signin', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/defra-id-signin', function (req, res) {
        req.session.myData.signedIn = "true"

        var _qs = ""
        if(req.session.myData.returnURL == "tasklist"){
            _qs = "?justsaved=true"
        }

        res.redirect(301, '/' + version + '/' + req.session.myData.returnURL + _qs);
    });

    // Signed out
    router.get('/' + version + '/signout', function (req, res, next) {
        
        req.session.myData.signedIn = "false"
            
        res.render(version + '/signout', {
            myData:req.session.myData
        });

    });

    // Start page
    router.get('/' + version + '/start', function (req, res) {
        res.render(version + '/start', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/start', function (req, res) {

        //Redirect to href
        if(req.session.myData.signedIn == "true"){
            res.redirect(301, '/' + version + '/applications');
        } else {

            res.redirect(301, '/' + version + '/defra-id-signin?returnURL=applications');

            //FOR LINKING TO ACTUAL DWFRA ID prototype - BUT this causes a bug with clearing myData when returning
            // if(req.headers.origin == 'http://localhost:3000') {
            //     // Local
            //     res.redirect(301, 'https://whoareyou:menotyou@identity-management-app.herokuapp.com/tasked/gov-gateway/login?returnUrl=http://localhost:3000/' + version + '/defraid-applications');
            // } else {
            //     // Live
            //     res.redirect(301, 'https://whoareyou:menotyou@identity-management-app.herokuapp.com/tasked/gov-gateway/login?returnUrl=https://defra:wildlife@sustainable-prototype.herokuapp.com/' + version + '/defraid-applications');
            // }
        }

    });

    // Start - select species
    router.get('/' + version + '/start-species', function (req, res) {
        res.render(version + '/start-species', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/start-species', function (req, res) {

        req.session.myData.startSpeciesAnswer = req.body.startSpecies

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.startSpeciesAnswer = req.session.myData.startSpeciesAnswer || "bat"
        }

        if(!req.session.myData.startSpeciesAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.startSpecies = {
                "anchor": "startSpecies-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/start-species', {
                myData: req.session.myData
            });
        } else {

            req.session.myData.selectedApplication.startSpecies = req.session.myData.startSpeciesAnswer


            switch(req.session.myData.selectedApplication.startSpecies) {
                case "bat":
                    _licenceType = "a13"
                    break;
                case "newt":
                    _licenceType = "a14"
                    break;
                case "badger":
                    _licenceType = "a24"
                    break;
                default:
                    _licenceType = "a13"
            }
           
            res.redirect(301, '/' + version + '/tasklist?new=true&l=' + _licenceType);

        }
        
    });

    // Tasklist bat
    router.get('/' + version + '/tasklist', function (req, res) {
        if(req.query.justsaved == "true"){
            req.session.myData.notifications.type = "saved"
            req.session.myData.showNotification = "true"
        }
        res.render(version + '/tasklist', {
            myData:req.session.myData
        });
    });

    // land owner?
    router.get('/' + version + '/land-owner', function (req, res) {
        res.render(version + '/land-owner', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/land-owner', function (req, res) {

        req.session.myData.landOwnerAnswer = req.body.landOwner

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.landOwnerAnswer = req.session.myData.landOwnerAnswer || "No"
        }

        if(!req.session.myData.landOwnerAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.landOwner = {
                "anchor": "landOwner-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/land-owner', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.landOwner = req.session.myData.landOwnerAnswer
            if(req.session.myData.selectedApplication.landOwner == "Yes"){
                req.session.myData.selectedApplication.landOwnerPermission = ""
            }

            var _cyaQS = ""
            if(req.query.cya == "true"){
                _cyaQS = "?cya=true"
            }
           
            if(req.session.myData.selectedApplication.landOwner == "No"){
                res.redirect(301, '/' + version + '/land-owner-permission' + _cyaQS);
            } else {
                if(req.query.cya == "true"){
                    res.redirect(301, '/' + version + '/cya-permission');
                } else {
                    res.redirect(301, '/' + version + '/consent');
                }
            }

        }
        
    });

    // land owner?
    router.get('/' + version + '/land-owner-permission', function (req, res) {
        res.render(version + '/land-owner-permission', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/land-owner-permission', function (req, res) {

        req.session.myData.landOwnerPermissionAnswer = req.body.landOwnerPermission

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.landOwnerPermissionAnswer = req.session.myData.landOwnerPermissionAnswer || "Yes"
        }

        if(!req.session.myData.landOwnerPermissionAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.landOwnerPermission = {
                "anchor": "landOwnerPermission-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/land-owner-permission', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.landOwnerPermission = req.session.myData.landOwnerPermissionAnswer
           
            if(req.session.myData.selectedApplication.landOwnerPermission == "No"){
                res.redirect(301, '/' + version + '/dropout-land-owner');
            } else {
                if(req.query.cya == "true"){
                    res.redirect(301, '/' + version + '/cya-permission');
                } else {
                    res.redirect(301, '/' + version + '/consent');
                }
            }

        }
        
    });

    // dropout - land owner permission
    router.get('/' + version + '/dropout-land-owner', function (req, res) {
        res.render(version + '/dropout-land-owner', {
            myData:req.session.myData
        });
    });

    // consent?
    router.get('/' + version + '/consent', function (req, res) {
        res.render(version + '/consent', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/consent', function (req, res) {

        var _was = req.session.myData.selectedApplication.consent

        req.session.myData.consentAnswer = req.body.consent

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.consentAnswer = req.session.myData.consentAnswer || "Yes"
        }

        if(!req.session.myData.consentAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.consent = {
                "anchor": "consent-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/consent', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.consent = req.session.myData.consentAnswer
            if(req.session.myData.selectedApplication.consent == "No"){
                req.session.myData.selectedApplication.consentGranted = ""
            }
           
            if(req.session.myData.selectedApplication.consent == "No"){
                res.redirect(301, '/' + version + '/cya-permission');
            } else {

                if(_was == "No" && req.session.myData.selectedApplication.consent == "Yes"){
                    res.redirect(301, '/' + version + '/consent-granted');
                } else {
                    if(req.query.cya == "true"){
                        res.redirect(301, '/' + version + '/cya-permission');
                    } else {
                        res.redirect(301, '/' + version + '/consent-granted');
                    }
                }
            }

        }
        
    });

    // consent granted?
    router.get('/' + version + '/consent-granted', function (req, res) {
        res.render(version + '/consent-granted', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/consent-granted', function (req, res) {

        req.session.myData.consentGrantedAnswer = req.body.consentGranted

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.consentGrantedAnswer = req.session.myData.consentGrantedAnswer || "Yes"
        }

        if(!req.session.myData.consentGrantedAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.consentGranted = {
                "anchor": "consentGranted-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/consent-granted', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.consentGranted = req.session.myData.consentGrantedAnswer

            req.session.myData.consentGrantedAnswer = ""
            
            if(req.session.myData.selectedApplication.consentGranted == "No"){
                res.redirect(301, '/' + version + '/dropout-consent-granted');
            } else {
                res.redirect(301, '/' + version + '/cya-permission');
            }

        }
        
    });

    // dropout - consent granted
    router.get('/' + version + '/dropout-consent-granted', function (req, res) {
        res.render(version + '/dropout-consent-granted', {
            myData:req.session.myData
        });
    });

    // Check your answers permission
    router.get('/' + version + '/cya-permission', function (req, res) {
        res.render(version + '/cya-permission', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-permission', function (req, res) {

        updateLastSavedDate(req,req.session.myData.selectedApplication)

        req.session.myData.selectedApplication.tasklist.sections["7"] = "completed"
        updateTasklist(req)
        req.session.myData.selectedApplication.status = "inprogress"

        res.redirect(301, '/' + version + '/eligible');
        
    });

    // Eligible
    router.get('/' + version + '/eligible', function (req, res) {
        res.render(version + '/eligible', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/eligible', function (req, res) {

        updateLastSavedDate(req,req.session.myData.selectedApplication)

        //Save application
        addApplicationToSavedApplications(req,req.session.myData.selectedApplication)
        setSelectedApplication(req, req.session.myData.selectedApplication.id)

        //Redirect to href
        if(req.session.myData.signedIn == "true"){
            res.redirect(301, '/' + version + '/tasklist?justsaved=true');
        } else {

            res.redirect(301, '/' + version + '/defra-id-signin?returnURL=tasklist');

            //FOR LINKING TO ACTUAL DWFRA ID prototype - BUT this causes a bug with clearing myData when returning
            // if(req.headers.origin == 'http://localhost:3000') {
            //     // Local
            //     res.redirect(301, 'https://whoareyou:menotyou@identity-management-app.herokuapp.com/tasked/gov-gateway/login?returnUrl=http://localhost:3000/' + version + '/defraid-tasklist');
            // } else {
            //     // Live
            //     res.redirect(301, 'https://whoareyou:menotyou@identity-management-app.herokuapp.com/tasked/gov-gateway/login?returnUrl=https://defra:wildlife@sustainable-prototype.herokuapp.com/' + version + '/defraid-tasklist');
            // }
        }

    });
  




    // Proposal
    router.get('/' + version + '/proposal', function (req, res) {

        req.session.myData.selectedApplication.tasklist.sections["1"] = "inprogress"

        res.render(version + '/proposal', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/proposal', function (req, res) {

        req.session.myData.proposalBatAnswer = req.body.proposalBat

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.proposalBatAnswer = req.session.myData.proposalBatAnswer || "Development work"
        }

        if(!req.session.myData.proposalBatAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.proposalBat = {
                "anchor": "proposalBat",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/proposal', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.proposalBat = req.session.myData.proposalBatAnswer

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-purpose');
            } else {
                res.redirect(301, '/' + version + '/category');
            }

        }
        
    });

    // Category bat
    router.get('/' + version + '/category', function (req, res) {
        res.render(version + '/category', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/category', function (req, res) {

        req.session.myData.categoryBatAnswer = req.body.categoryBat

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.categoryBatAnswer = req.session.myData.categoryBatAnswer || req.session.myData.workCategories[0].id
        }

        if(!req.session.myData.categoryBatAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.categoryBat = {
                "anchor": "categoryBat",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/category', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            var _category = req.session.myData.workCategories.find(obj => {return obj.id.toString() === req.session.myData.categoryBatAnswer.toString()});

            req.session.myData.selectedApplication.categoryBat = JSON.parse(JSON.stringify(_category))

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-purpose');
            } else {
                if(req.session.myData.requiredQuestions["CD16"]){
                    res.redirect(301, '/' + version + '/reason');
                } else {
                    res.redirect(301, '/' + version + '/multiplot');
                }
            }

        }
        
    });

    // Reason
    router.get('/' + version + '/reason', function (req, res) {
        res.render(version + '/reason', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/reason', function (req, res) {

        req.session.myData.reasonBatAnswer = req.body.reasonBat

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.reasonBatAnswer = req.session.myData.reasonBatAnswer || req.session.myData.batApplicationReasons[0].id
        }

        if(!req.session.myData.reasonBatAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.reasonBat = {
                "anchor": "reasonBat",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/reason', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            var _reason = req.session.myData.batApplicationReasons.find(obj => {return obj.id.toString() === req.session.myData.reasonBatAnswer.toString()});

            req.session.myData.selectedApplication.reasonBat = JSON.parse(JSON.stringify(_reason))

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-purpose');
            } else {
                res.redirect(301, '/' + version + '/multiplot');
            }

        }
        
    });

    // Multiplot?
    router.get('/' + version + '/multiplot', function (req, res) {
        res.render(version + '/multiplot', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/multiplot', function (req, res) {

        req.session.myData.multiplotBatAnswer = req.body.multiplotBat

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.multiplotBatAnswer = req.session.myData.multiplotBatAnswer || "No"
        }

        if(!req.session.myData.multiplotBatAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.multiplotBat = {
                "anchor": "multiplotBat-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/multiplot', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.multiplot = req.session.myData.multiplotBatAnswer
           
            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-purpose');
            } else {
                res.redirect(301, '/' + version + '/work-home');
            }

        }
        
    });

    // Work home?
    router.get('/' + version + '/work-home', function (req, res) {
        res.render(version + '/work-home', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/work-home', function (req, res) {

        req.session.myData.workHomeAnswer = req.body.workHome

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.workHomeAnswer = req.session.myData.workHomeAnswer || "No"
        }

        if(!req.session.myData.workHomeAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.workHome = {
                "anchor": "workHome-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/work-home', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.workhome = req.session.myData.workHomeAnswer
           
            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-purpose');
            } else {
                if(req.session.myData.requiredQuestions["CD22"]){
                    res.redirect(301, '/' + version + '/work-small');
                } else {
                    res.redirect(301, '/' + version + '/work-protected');
                }
            }

        }
        
    });

    // Work small?
    router.get('/' + version + '/work-small', function (req, res) {
        res.render(version + '/work-small', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/work-small', function (req, res) {

        req.session.myData.workSmallAnswer = req.body.workSmall

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.workSmallAnswer = req.session.myData.workSmallAnswer || "No"
        }

        if(!req.session.myData.workSmallAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.workSmall = {
                "anchor": "workSmall-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/work-small', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.worksmall = req.session.myData.workSmallAnswer
           
            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-purpose');
            } else {
                res.redirect(301, '/' + version + '/work-protected');
            }

        }
        
    });

    // Work protected?
    router.get('/' + version + '/work-protected', function (req, res) {
        res.render(version + '/work-protected', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/work-protected', function (req, res) {

        req.session.myData.workProtectedAnswer = req.body.workProtected

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.workProtectedAnswer = req.session.myData.workProtectedAnswer || "No"
        }

        if(!req.session.myData.workProtectedAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.workProtected = {
                "anchor": "workProtected-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/work-protected', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.workprotected = req.session.myData.workProtectedAnswer
           
            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-purpose');
            } else {
                if(req.session.myData.requiredQuestions["CD24"]){
                    res.redirect(301, '/' + version + '/work-public');
                } else {
                    if(req.session.myData.requiredQuestions["CD27"]){
                        res.redirect(301, '/' + version + '/important-populations');
                    } else {
                        res.redirect(301, '/' + version + '/cya-purpose');
                    }
                }
            }

        }
        
    });

    // Work public?
    router.get('/' + version + '/work-public', function (req, res) {
        res.render(version + '/work-public', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/work-public', function (req, res) {

        req.session.myData.workPublicAnswer = req.body.workPublic

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.workPublicAnswer = req.session.myData.workPublicAnswer || "No"
        }

        if(!req.session.myData.workPublicAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.workPublic = {
                "anchor": "workPublic-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/work-public', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.workpublic = req.session.myData.workPublicAnswer
           
            if(req.session.myData.selectedApplication.workpublic == "Yes"){
                res.redirect(301, '/' + version + '/work-extend');
            } else {
                if(req.query.cya == "true"){
                    res.redirect(301, '/' + version + '/cya-purpose');
                } else {
                    if(req.session.myData.requiredQuestions["CD27"]){
                        res.redirect(301, '/' + version + '/important-populations');
                    } else {
                        res.redirect(301, '/' + version + '/cya-purpose');
                    }
                }
            }

        }
        
    });

    // Work extend?
    router.get('/' + version + '/work-extend', function (req, res) {
        res.render(version + '/work-extend', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/work-extend', function (req, res) {

        req.session.myData.workExtendAnswer = req.body.workExtend

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.workExtendAnswer = req.session.myData.workExtendAnswer || "No"
        }

        if(!req.session.myData.workExtendAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.workExtend = {
                "anchor": "workExtend-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/work-public', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.workextend = req.session.myData.workExtendAnswer

            if(req.session.myData.selectedApplication.workextend == "No"){
                res.redirect(301, '/' + version + '/work-private');
            } else {
                if(req.query.cya == "true"){
                    res.redirect(301, '/' + version + '/cya-purpose');
                } else {
                    res.redirect(301, '/' + version + '/important-populations');
                }
            }

        }
        
    });

    // Work private?
    router.get('/' + version + '/work-private', function (req, res) {
        res.render(version + '/work-private', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/work-private', function (req, res) {

        req.session.myData.workPrivateAnswer = req.body.workPrivate

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.workPrivateAnswer = req.session.myData.workPrivateAnswer || "No"
        }

        if(!req.session.myData.workPrivateAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.workPrivate = {
                "anchor": "workPrivate-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/work-private', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.workprivate = req.session.myData.workPrivateAnswer
           
            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-purpose');
            } else {
                res.redirect(301, '/' + version + '/important-populations');
            }

        }
        
    });

    // Important populations?
    router.get('/' + version + '/important-populations', function (req, res) {
        res.render(version + '/important-populations', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/important-populations', function (req, res) {

        req.session.myData.importantPopulationsAnswer = req.body.importantPopulations

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.importantPopulationsAnswer = req.session.myData.importantPopulationsAnswer || "No"
        }

        if(!req.session.myData.importantPopulationsAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.importantPopulations = {
                "anchor": "importantPopulations-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/important-populations', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.importantpopulations = req.session.myData.importantPopulationsAnswer
           
            res.redirect(301, '/' + version + '/cya-purpose');

        }
        
    });

    // Check your answers - purpose
    router.get('/' + version + '/cya-purpose', function (req, res) {
        res.render(version + '/cya-purpose', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-purpose', function (req, res) {

        updateLastSavedDate(req,req.session.myData.selectedApplication)

        req.session.myData.selectedApplication.tasklist.sections["1"] = "completed"
        updateTasklist(req)
        res.redirect(301, '/' + version + '/tasklist');
        
    });




    // Intro consents
    router.get('/' + version + '/intro-consent', function (req, res) {

        req.session.myData.selectedApplication.tasklist.sections["8"] = "inprogress"

        res.render(version + '/intro-consent', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/intro-consent', function (req, res) {
        updateLastSavedDate(req,req.session.myData.selectedApplication)
        res.redirect(301, '/' + version + '/consent-type');
    });


    // Consent type
    router.get('/' + version + '/consent-type', function (req, res) {
        res.render(version + '/consent-type', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/consent-type', function (req, res) {

        var _was = req.session.myData.selectedConsent.type.id

        req.session.myData.consentTypeTempAnswer = req.body.consentType

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.consentTypeTempAnswer = req.session.myData.consentTypeTempAnswer || "_consentType-1"
        }
        if(!req.session.myData.consentTypeTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.consentTypeAnswer = {
                "anchor": "_consentType-1",
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/consent-type', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.consentTypes.forEach(function(_consentType, index) {
                if(req.session.myData.consentTypeTempAnswer == _consentType.id){
                    req.session.myData.selectedConsent.type = JSON.parse(JSON.stringify(_consentType))
                }
            });
            //remove pre-saved reference if type changed duriong cya change answers flow
            // if(_was != req.session.myData.consentTypeTempAnswer){
            //     req.session.myData.selectedConsent.consentReference = ""
            // }
            req.session.myData.consentTypeTempAnswer = ""

            //Consent query string
            var _consentQS = ''
            if(!req.session.myData.selectedConsent.new){
                _consentQS = '?consent=' + req.session.myData.consent
            }

            res.redirect(301, '/' + version + '/consent-reference' + _consentQS);
        }
    });

    //Consent reference
    router.get('/' + version + '/consent-reference', function (req, res) {
        res.render(version + '/consent-reference', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/consent-reference', function (req, res) {

        req.session.myData.consentReferenceAnswer = req.body.consentReference

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.consentReferenceAnswer = req.session.myData.consentReferenceAnswer || "123/45678/9A"
        }

        if(!req.session.myData.consentReferenceAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.consentReference = {
                "anchor": "consentReference",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/consent-reference', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedConsent.consentReference = req.session.myData.consentReferenceAnswer

            //ADD CONSENT TO APPLICATION
            addConsentToApplication(req,req.session.myData.selectedConsent)

            setSelectedConsent(req,req.session.myData.selectedConsent.id.toString())

            res.redirect(301, '/' + version + '/cya-consents');

        }
        
    });

    // Check your answers consents
    router.get('/' + version + '/cya-consents', function (req, res) {
        res.render(version + '/cya-consents', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-consents', function (req, res) {

        req.session.myData.addConsentAnswer = req.body.addConsent

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.addConsentAnswer = req.session.myData.addConsentAnswer || "No"
        }

        if(!req.session.myData.addConsentAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.addConsent = {
                "anchor": "addConsent-1",
                "message": "[error message for add consent]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/cya-consents', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            if(req.session.myData.addConsentAnswer == 'Yes'){
                startNewConsent(req)
                res.redirect(301, '/' + version + '/intro-consent');
            } else {
                req.session.myData.selectedApplication.tasklist.sections["8"] = "completed"
                updateTasklist(req)
                res.redirect(301, '/' + version + '/tasklist');
            }

        }
         
    });

    // Consent remove
    router.get('/' + version + '/consent-remove', function (req, res) {

        req.session.myData.consentToRemove = req.query.consentToRemove
        

        req.session.myData.selectedConsentToRemove = req.session.myData.selectedApplication.consents.find(obj => {return obj.id.toString() === req.session.myData.consentToRemove})

        res.render(version + '/consent-remove', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/consent-remove', function (req, res) {

        req.session.myData.removeConsentAnswer = req.body.removeConsent

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.removeConsentAnswer = req.session.myData.removeConsentAnswer || "No"
        }

        if(!req.session.myData.removeConsentAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.removeConsent = {
                "anchor": "removeConsent-1",
                "message": "[error message for remove consent]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/consent-remove', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            if(req.session.myData.removeConsentAnswer == 'Yes'){

                var _removeID = req.session.myData.consentToRemove.toString(),
                    _consent = req.session.myData.selectedApplication.consents.find(obj => {return obj.id.toString() === _removeID})
                
                if(_consent){
                    //remove it
                    var removeIndex = req.session.myData.selectedApplication.consents.map(item => item.id.toString()).indexOf(_removeID);
                    (removeIndex >= 0) && req.session.myData.selectedApplication.consents.splice(removeIndex, 1);
                }

                if(req.session.myData.selectedApplication.consents.length == 0) {
                    startNewConsent(req)
                    res.redirect(301, '/' + version + '/intro-consent');
                } else {
                    res.redirect(301, '/' + version + '/cya-consents');
                }
                

            } else {
                res.redirect(301, '/' + version + '/cya-consents');
            }

        }
    });






    // Intro habitats
    router.get('/' + version + '/habitat-intro', function (req, res) {

        req.session.myData.selectedApplication.tasklist.sections["2"] = "inprogress"

        res.render(version + '/habitat-intro', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/habitat-intro', function (req, res) {
        updateLastSavedDate(req,req.session.myData.selectedApplication)

        if(req.session.myData.selectedApplication.type == "a13"){
            res.redirect(301, '/' + version + '/habitat-species');
        } else {
            //Habitat query string
            var _habitatQS = ''
            if(!req.session.myData.selectedHabitat.new){
                _habitatQS = '?habitat=' + req.session.myData.habitat
            }

            res.redirect(301, '/' + version + '/habitat-type' + _habitatQS);
        }

    });


    // BAT Species
    router.get('/' + version + '/habitat-species', function (req, res) {
        res.render(version + '/habitat-species', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/habitat-species', function (req, res) {

        req.session.myData.speciesTempAnswer = req.body.species

        var _speciesToUse = req.session.myData.batSpecies2

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.speciesTempAnswer = req.body.species || _speciesToUse[0].id
        }
        if(!req.session.myData.speciesTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.species = {
                "anchor": _speciesToUse[0].id,
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/habitat-species', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            _speciesToUse.forEach(function(_species, index) {
                if(req.session.myData.speciesTempAnswer == _species.id){
                    req.session.myData.selectedHabitat.speciesID = _species.id
                    req.session.myData.selectedHabitat.speciesName = _species.name
                }
            });

            req.session.myData.speciesTempAnswer = ""

            //Habitat query string
            var _habitatQS = ''
            if(!req.session.myData.selectedHabitat.new){
                _habitatQS = '?habitat=' + req.session.myData.habitat
            }

            res.redirect(301, '/' + version + '/habitat-type' + _habitatQS);
        }
    });


    // Habitat use
    router.get('/' + version + '/habitat-type', function (req, res) {
        res.render(version + '/habitat-type', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/habitat-type', function (req, res) {

        req.session.myData.habitatUsesAnswersTemp = req.body.habitatUses

        // if radios then its undefined
        // if checkboxes then its _unchecked

        var _habitatUsesToUse = req.session.myData.roostUses3
        if(req.session.myData.selectedApplication.type == "a24"){
            _habitatUsesToUse = req.session.myData.settUses
        }

        if(req.session.myData.includeValidation == "false"){
            if(req.session.myData.habitatUsesAnswersTemp == "_unchecked" || !req.session.myData.habitatUsesAnswersTemp){
                req.session.myData.habitatUsesAnswersTemp = _habitatUsesToUse[0].id
            } else {
                req.session.myData.habitatUsesAnswersTemp = req.session.myData.habitatUsesAnswersTemp || _habitatUsesToUse[0].id
            }
        }
        if(req.session.myData.habitatUsesAnswersTemp == "_unchecked" || !req.session.myData.habitatUsesAnswersTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.habitatUses = {
                "anchor": _habitatUsesToUse[0].id,
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/habitat-type', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            //Set selected habitat uses
            req.session.myData.selectedHabitat.habitatUses = []
            _habitatUsesToUse.forEach(function(_habitatUse, index) {

                if(req.session.myData.selectedApplication.habitatType == "multiple"){
                    if(req.session.myData.habitatUsesAnswersTemp.indexOf(_habitatUse.id.toString()) != -1){
                        req.session.myData.selectedHabitat.habitatUses.push(_habitatUse)
                    }
                } else if(req.session.myData.selectedApplication.habitatType == "single") {
                    if(req.session.myData.habitatUsesAnswersTemp == _habitatUse.id.toString()){
                        req.session.myData.selectedHabitat.habitatUses.push(_habitatUse)
                    }
                }
                
            });
            req.session.myData.habitatUsesAnswersTemp = []
            
            //Habitat query string
            var _habitatQS = ''
            if(!req.session.myData.selectedHabitat.new){
                _habitatQS = '?habitat=' + req.session.myData.habitat
            }

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-habitats');
            } else {
                if(req.session.myData.selectedApplication.type == "a13"){
                    res.redirect(301, '/' + version + '/habitat-numbers' + _habitatQS);
                } else {
                    res.redirect(301, '/' + version + '/habitat-active' + _habitatQS);
                }
            }

        }

    });


    // Species Numbers
    router.get('/' + version + '/habitat-numbers', function (req, res) {
        res.render(version + '/habitat-numbers', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/habitat-numbers', function (req, res) {

        //entered values (set to temp)
        req.session.myData.numberUsingTemp = req.body.numberUsing

        //no validation defaults
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.numberUsingTemp = req.session.myData.numberUsingTemp || 1
        }

        // TODO order of errors

        //check validation
        if(!req.session.myData.numberUsingTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.numberUsing = {
                "anchor": "numberUsing",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/habitat-numbers', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.numberUsing = req.session.myData.numberUsingTemp
            req.session.myData.selectedHabitat.numberUsing = req.session.myData.numberUsing

            req.session.myData.numberUsingTemp = ""

            //Habitat query string
            var _habitatQS = ''
            if(!req.session.myData.selectedHabitat.new){
                _habitatQS = '?habitat=' + req.session.myData.habitat
            }

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-habitats');
            } else {
                res.redirect(301, '/' + version + '/habitat-activities' + _habitatQS);
            }

        }
        
    });

    // Breeding sites Numbers
    router.get('/' + version + '/numbers-breeding-sites', function (req, res) {
        res.render(version + '/numbers-breeding-sites', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/numbers-breeding-sites', function (req, res) {

        //entered values (set to temp)
        req.session.myData.breedingSitesTemp = req.body.breedingSites

        //no validation defaults
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.breedingSitesTemp = req.session.myData.breedingSitesTemp || 1
        }

        //check validation
        if(!req.session.myData.breedingSitesTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.breedingSites = {
                "anchor": "breedingSites",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/numbers-breeding-sites', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.breedingSites = req.session.myData.breedingSitesTemp
            req.session.myData.breedingSitesTemp = ""

            //Habitat query string
            // var _habitatQS = ''
            // if(!req.session.myData.selectedHabitat.new){
            //     _habitatQS = '?habitat=' + req.session.myData.habitat
            // }

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-newt');
            } else {
                res.redirect(301, '/' + version + '/activities-newt');
            }

        }
        
    });

    // Activities on habitat
    router.get('/' + version + '/habitat-activities', function (req, res) {
        res.render(version + '/habitat-activities', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/habitat-activities', function (req, res) {

        req.session.myData.activitiesAnswersTemp = req.body.habitatActivities

        var _habitatActivitiesToUse = req.session.myData.batActivities3
        if(req.session.myData.selectedApplication.type == "a24"){
            _habitatActivitiesToUse = req.session.myData.badgerActivities
        }

        if(req.session.myData.includeValidation == "false"){
            if(req.session.myData.activitiesAnswersTemp == "_unchecked"){
                req.session.myData.activitiesAnswersTemp = _habitatActivitiesToUse[0].id
            } else {
                req.session.myData.activitiesAnswersTemp = req.session.myData.activitiesAnswersTemp || _habitatActivitiesToUse[0].id
            }
        }
        if(req.session.myData.activitiesAnswersTemp == "_unchecked"){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.habitatActivities = {
                "anchor": _habitatActivitiesToUse[0].id,
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/habitat-activities', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            //Set selected bat activties
            req.session.myData.selectedHabitat.activities = []
            _habitatActivitiesToUse.forEach(function(_habitatActivity, index) {
                if(req.session.myData.activitiesAnswersTemp.indexOf(_habitatActivity.id.toString()) != -1){
                    req.session.myData.selectedHabitat.activities.push(_habitatActivity)
                }
            });
            req.session.myData.activitiesAnswersTemp = []

            //ADD HABITAT TO APPLICATION
            addHabitatToApplication(req,req.session.myData.selectedHabitat)

            setSelectedHabitat(req,req.session.myData.selectedHabitat.id.toString())
            
            //TODO check if this needs to be set BEFORE changing new to false
            //Habitat query string
            var _habitatQS = ''
            if(!req.session.myData.selectedHabitat.new){
                _habitatQS = '?habitat=' + req.session.myData.habitat
            }

            res.redirect(301, '/' + version + '/cya-habitats');
        }

    });

    // Habitat active
    router.get('/' + version + '/habitat-active', function (req, res) {
        res.render(version + '/habitat-active', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/habitat-active', function (req, res) {

        req.session.myData.habitatActiveAnswer = req.body.habitatActive

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.habitatActiveAnswer = req.session.myData.habitatActiveAnswer || "Yes"
        }

        if(!req.session.myData.habitatActiveAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.habitatActive = {
                "anchor": "habitatActive-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/habitat-active', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedHabitat.habitatActive = req.session.myData.habitatActiveAnswer

            //Habitat query string
            var _habitatQS = ''
            if(!req.session.myData.selectedHabitat.new){
                _habitatQS = '?habitat=' + req.session.myData.habitat
            }

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-habitats');
            } else {
                res.redirect(301, '/' + version + '/habitat-reopen' + _habitatQS);
            }

        }
        
    });

    // Habitat reopening
    router.get('/' + version + '/habitat-reopen', function (req, res) {
        res.render(version + '/habitat-reopen', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/habitat-reopen', function (req, res) {

        req.session.myData.habitatReopenAnswer = req.body.habitatReopen

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.habitatReopenAnswer = req.session.myData.habitatReopenAnswer || "Yes"
        }

        if(!req.session.myData.habitatReopenAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.habitatReopen = {
                "anchor": "habitatReopen-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/habitat-reopen', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedHabitat.habitatReopen = req.session.myData.habitatReopenAnswer

            //Habitat query string
            var _habitatQS = ''
            if(!req.session.myData.selectedHabitat.new){
                _habitatQS = '?habitat=' + req.session.myData.habitat
            }

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-habitats');
            } else {
                res.redirect(301, '/' + version + '/habitat-entrances' + _habitatQS);
            }

        }
        
    });

    // Entrance holes
    router.get('/' + version + '/habitat-entrances', function (req, res) {
        res.render(version + '/habitat-entrances', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/habitat-entrances', function (req, res) {

        //entered values (set to temp)
        req.session.myData.entranceHolesTemp = req.body.entranceHoles

        //no validation defaults
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.entranceHolesTemp = req.session.myData.entranceHolesTemp || 1
        }

        // TODO order of errors

        //check validation
        if(!req.session.myData.entranceHolesTemp){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.entranceHoles = {
                "anchor": "entranceHoles",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/habitat-entrances', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.entranceHoles = req.session.myData.entranceHolesTemp
            req.session.myData.selectedHabitat.entranceHoles = req.session.myData.entranceHoles

            req.session.myData.entranceHolesTemp = ""

            //Habitat query string
            var _habitatQS = ''
            if(!req.session.myData.selectedHabitat.new){
                _habitatQS = '?habitat=' + req.session.myData.habitat
            }

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-habitats');
            } else {
                res.redirect(301, '/' + version + '/habitat-activities' + _habitatQS);
            }

        }
        
    });
    
    // Activities on newts 
    router.get('/' + version + '/activities-newt', function (req, res) {
        res.render(version + '/activities-newt', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/activities-newt', function (req, res) {

        req.session.myData.newtActivitiesTemp = req.body.newtActivities

        if(req.session.myData.includeValidation == "false"){
            if(req.session.myData.newtActivitiesTemp == "_unchecked"){
                req.session.myData.newtActivitiesTemp = "_newtActivity-1"
            } else {
                req.session.myData.newtActivitiesTemp = req.session.myData.newtActivitiesTemp || "_newtActivity-1"
            }
        }

        //check validation
        if(req.session.myData.newtActivitiesTemp == "_unchecked"){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.newtActivities = {
                "anchor": "_newtActivity-1",
                "message": "[error message]"
            }
        } 

        if(req.session.myData.validationError == "true") {
            res.render(version + '/activities-newt', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.newtActivities = []
            //Set selected newt activities
            req.session.myData.newtActivities.forEach(function(_newtActivity, index) {
                if(req.session.myData.newtActivitiesTemp.indexOf(_newtActivity.id.toString()) != -1){
                    req.session.myData.selectedApplication.newtActivities.push(_newtActivity)
                }
            });
            
            //TODO check if this needs to be set BEFORE changing new to false
            //Habitat query string
            // var _habitatQS = ''
            // if(!req.session.myData.selectedHabitat.new){
            //     _habitatQS = '?habitat=' + req.session.myData.habitat
            // }

            res.redirect(301, '/' + version + '/cya-newt');

        }

    });

    // Check your answers bat
    router.get('/' + version + '/cya-habitats', function (req, res) {
        res.render(version + '/cya-habitats', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-habitats', function (req, res) {

        req.session.myData.addHabitatAnswer = req.body.addHabitat

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.addHabitatAnswer = req.session.myData.addHabitatAnswer || "No"
        }

        if(!req.session.myData.addHabitatAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.addHabitat = {
                "anchor": "addHabitat-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/cya-habitats', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            if(req.session.myData.addHabitatAnswer == 'yes'){
                startNewHabitat(req)
                res.redirect(301, '/' + version + '/habitat-intro');
            } else {
                req.session.myData.selectedApplication.tasklist.sections["2"] = "completed"
                updateTasklist(req)
                res.redirect(301, '/' + version + '/tasklist');
            }

        }
         
    });

    // Check your answers newt
    router.get('/' + version + '/cya-newt', function (req, res) {
        res.render(version + '/cya-newt', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-newt', function (req, res) {
        updateLastSavedDate(req,req.session.myData.selectedApplication)
        req.session.myData.selectedApplication.tasklist.sections["2"] = "completed"
        updateTasklist(req)
        res.redirect(301, '/' + version + '/tasklist');
    });


    // Habitat remove
    router.get('/' + version + '/habitat-remove', function (req, res) {

        req.session.myData.habitatToRemove = req.query.habitatToRemove

        res.render(version + '/habitat-remove', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/habitat-remove', function (req, res) {

        req.session.myData.removeHabitatAnswer = req.body.removeHabitat

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.removeHabitatAnswer = req.session.myData.removeHabitatAnswer || "No"
        }

        if(!req.session.myData.removeHabitatAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.removeHabitat = {
                "anchor": "removeHabitat-1",
                "message": "[error message for remove habitat]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/habitat-remove', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            if(req.session.myData.removeHabitatAnswer == 'yes'){

                var _removeID = req.session.myData.habitatToRemove.toString(),
                    _habitat = req.session.myData.selectedApplication.habitats.find(obj => {return obj.id.toString() === _removeID})
                
                if(_habitat){
                    //remove it
                    var removeIndex = req.session.myData.selectedApplication.habitats.map(item => item.id.toString()).indexOf(_removeID);
                    (removeIndex >= 0) && req.session.myData.selectedApplication.habitats.splice(removeIndex, 1);
                }

                if(req.session.myData.selectedApplication.habitats.length == 0) {
                    startNewHabitat(req)
                    res.redirect(301, '/' + version + '/habitat-intro');
                } else {
                    res.redirect(301, '/' + version + '/cya-habitats');
                }
                

            } else {
                res.redirect(301, '/' + version + '/cya-habitats');
            }

        }
    });

    // Complete
    router.get('/' + version + '/complete', function (req, res) {

        req.session.myData.selectedApplication.tasklist.sections["3"] = "completed"
        updateTasklist(req)

        req.session.myData.selectedApplication.status = "submitted"

        res.render(version + '/complete', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/complete', function (req, res) {
        updateLastSavedDate(req,req.session.myData.selectedApplication)
        res.redirect(301, '/' + version + '/applications');
    });

    //Site name
    router.get('/' + version + '/site-name', function (req, res) {

        req.session.myData.selectedApplication.tasklist.sections["4"] = "inprogress"

        res.render(version + '/site-name', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/site-name', function (req, res) {

        req.session.myData.siteNameAnswer = req.body.siteName

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.siteNameAnswer = req.session.myData.siteNameAnswer || "Farmland"
        }

        if(!req.session.myData.siteNameAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.siteName = {
                "anchor": "siteName",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/site-name', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.siteName = req.session.myData.siteNameAnswer

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-site');
            } else {
                if(req.session.myData.selectedApplication.tasklist.sections["5"] == "completed"){
                    res.redirect(301, '/' + version + '/site-addresses');
                } else {
                    res.redirect(301, '/' + version + '/site-postcode');
                }
            }

        }
        
    });

    // Site addresses
    router.get('/' + version + '/site-addresses', function (req, res) {
        res.render(version + '/site-addresses', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/site-addresses', function (req, res) {

        req.session.myData.siteAddressesTempAnswer = req.body.siteAddresses

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.siteAddressesTempAnswer = req.body.siteAddresses || "changeAddress"
        }
        if(!req.session.myData.siteAddressesTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.siteAddressesAnswer = {
                "anchor": "",
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/site-addresses', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.siteAddresses = req.session.myData.siteAddressesTempAnswer
            req.session.myData.siteAddressesTempAnswer = ""

            if(req.session.myData.siteAddresses == "changeAddress"){

                req.session.myData.selectedApplication.siteAddress = ""
                req.session.myData.selectedApplication.hasPostcode = ""
                req.session.myData.selectedApplication.sitePostcode = ""

                res.redirect(301, '/' + version + '/site-postcode');
            } else {

                req.session.myData.selectedApplication.siteAddress = req.session.myData.siteAddresses
                req.session.myData.selectedApplication.hasPostcode = "Yes"
                req.session.myData.selectedApplication.sitePostcode = req.session.myData.selectedApplication.applicantPostcode

                res.redirect(301, '/' + version + '/site-method');
            }
            
        }
    });

    // Site postcode
    router.get('/' + version + '/site-postcode', function (req, res) {
        res.render(version + '/site-postcode', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/site-postcode', function (req, res) {

        req.session.myData.hasPostcodeTempAnswer = req.body.hasPostcode
        req.session.myData.sitePostcodeTempAnswer = req.body.sitePostcode

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.hasPostcodeTempAnswer = req.session.myData.hasPostcodeTempAnswer || "Yes"
            req.session.myData.sitePostcodeTempAnswer = req.session.myData.sitePostcodeTempAnswer || "B1 3AA"
        }

        if(!req.session.myData.hasPostcodeTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.hasPostcode = {
                "anchor": "hasPostcode",
                "message": "[error message 1]"
            }
        }
        if(req.session.myData.hasPostcodeTempAnswer == "Yes" && !req.session.myData.sitePostcodeTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.sitePostcode = {
                "anchor": "sitePostcode",
                "message": "[error message 2]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/site-postcode', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.hasPostcode = req.session.myData.hasPostcodeTempAnswer 
            req.session.myData.selectedApplication.sitePostcode = req.session.myData.sitePostcodeTempAnswer

            req.session.myData.hasPostcodeTempAnswer = ""
            req.session.myData.sitePostcodeTempAnswer = ""

            var _cyaQS = ""
            if(req.query.cya == "true"){
                _cyaQS = "?cya=true"
            }

            if (req.session.myData.selectedApplication.hasPostcode == "Yes"){
                res.redirect(301, '/' + version + '/site-address' + _cyaQS);
            } else {
                if(req.query.cya == "true"){
                    res.redirect(301, '/' + version + '/cya-site');
                } else {
                    res.redirect(301, '/' + version + '/site-method');
                }
            }

        }

    });

    // Site address
    router.get('/' + version + '/site-address', function (req, res) {
        res.render(version + '/site-address', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/site-address', function (req, res) {

        req.session.myData.siteAddressTempAnswer = req.body.siteAddress

        if(req.session.myData.includeValidation == "false"){
            if(req.session.myData.siteAddressTempAnswer == "select"){
                req.session.myData.siteAddressTempAnswer = "1 High Street"
            } else {
                req.session.myData.siteAddressTempAnswer = req.session.myData.siteAddressTempAnswer || "1 High Street"
            }
        }
        if(req.session.myData.siteAddressTempAnswer == "select"){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.siteAddress = {
                "anchor": "siteAddress",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/site-address', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.siteAddress = req.session.myData.siteAddressTempAnswer
            req.session.myData.siteAddressTempAnswer = ""

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-site');
            } else {
                res.redirect(301, '/' + version + '/site-method');
            }

        }

    });

    //TODO add error style to all text boxes (red border on text inputs)

    // Site method
    router.get('/' + version + '/site-method', function (req, res) {

        if (req.query.address == "select"){
            req.session.myData.selectedApplication.siteAddress = "select"
        }

        res.render(version + '/site-method', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/site-method', function (req, res) {

        req.session.myData.siteMethodAnswer = req.body.siteMethod

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.siteMethodAnswer = req.session.myData.siteMethodAnswer || "draw"
        }

        if(!req.session.myData.siteMethodAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.siteMethod = {
                "anchor": "siteMethod-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/site-method', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.siteMethod = req.session.myData.siteMethodAnswer
           
            if(req.session.myData.selectedApplication.siteMethod == "upload"){
                res.redirect(301, '/' + version + '/site-upload');
            } else {
                res.redirect(301, '/' + version + '/site-boundary' + "?findlocation=place&location=" + req.session.myData.selectedApplication.sitePostcode);
            }

        }
        
    });

    //Site upload
    router.get('/' + version + '/site-upload', function (req, res) {
        res.render(version + '/site-upload', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/site-upload', function (req, res) {

        req.session.myData.siteUploadAnswer = req.body.siteUpload

        // if(req.session.myData.includeValidation == "false"){
            req.session.myData.siteUploadAnswer = req.session.myData.siteUploadAnswer || "file-name.kml"
        // }

        // if(!req.session.myData.siteUploadAnswer){
        //     req.session.myData.validationError = "true"
        //     req.session.myData.validationErrors.siteUpload = {
        //         "anchor": "siteUpload",
        //         "message": "[error message]"
        //     }
        // }

        // if(req.session.myData.validationError == "true") {
        //     res.render(version + '/site-upload', {
        //         myData: req.session.myData
        //     });
        // } else {
            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.siteUpload = req.session.myData.siteUploadAnswer
            req.session.myData.siteUploadAnswer = ""

            res.redirect(301, '/' + version + '/cya-site');
        // }
        
    });

    //Site boundary
    router.get('/' + version + '/site-boundary', function (req, res) {

        req.session.myData.findlocationplace = req.query.location
        req.session.myData.findlocationgridref = req.query.gridref

        if (req.query.address == "select"){
            req.session.myData.selectedApplication.siteAddress = "select"
        }

        if((req.session.myData.findlocation == "place" && !req.query.location) || (req.session.myData.findlocation == "gridref" && !req.query.gridref)){
            req.session.myData.findlocation = ""
        }

        res.render(version + '/site-boundary', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/site-boundary', function (req, res) {
        updateLastSavedDate(req,req.session.myData.selectedApplication)
        res.redirect(301, '/' + version + '/cya-site');
    });  

    //CYA Site boundary
    router.get('/' + version + '/cya-site', function (req, res) {
        res.render(version + '/cya-site', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-site', function (req, res) {

        updateLastSavedDate(req,req.session.myData.selectedApplication)

        req.session.myData.selectedApplication.tasklist.sections["4"] = "completed"
        updateTasklist(req)

        res.redirect(301, '/' + version + '/tasklist');
    }); 
    
    // Applicant - user
    router.get('/' + version + '/applicant-user', function (req, res) {
        req.session.myData.selectedApplication.tasklist.sections["5"] = "inprogress"
        res.render(version + '/applicant-user', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-user', function (req, res) {

        var _was = req.session.myData.selectedApplication.userIsApplicant

        req.session.myData.userIsApplicantAnswer = req.body.userIsApplicant

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.userIsApplicantAnswer = req.session.myData.userIsApplicantAnswer || "No"
        }

        if(!req.session.myData.userIsApplicantAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.userIsApplicant = {
                "anchor": "userIsApplicant-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/applicant-user', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.userIsApplicant = req.session.myData.userIsApplicantAnswer

            if(req.session.myData.selectedApplication.userIsApplicant == "Yes"){
                req.session.myData.selectedApplicant = req.session.myData.user
                req.session.myData.selectedApplication.applicantName = req.session.myData.user.userName
            } else {
                // req.session.myData.selectedApplication.applicantName = ""
            }

            //if came from change yes/no

            if(_was == req.session.myData.selectedApplication.userIsApplicant && req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-applicant');
            
            } else {

                if(req.session.myData.selectedApplication.userIsApplicant == "No"){
                    if(req.session.myData.applicants.length > 0){
                        // go to new applicant name list is 1 or more saved applicants
                        res.redirect(301, '/' + version + '/applicant-names');
                    } else {
                        res.redirect(301, '/' + version + '/applicant-name');
                    }
                } else {
                    if(req.session.myData.user.companies.length > 0){
                        // go to new applicant company list is 1 or more saved companies on this user
                        res.redirect(301, '/' + version + '/applicant-companies');
                    } else {
                        res.redirect(301, '/' + version + '/applicant-company');
                    }
                }
            }

        }
        
    });

     // Applicant names
     router.get('/' + version + '/applicant-names', function (req, res) {
        res.render(version + '/applicant-names', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-names', function (req, res) {

        req.session.myData.applicantNamesTempAnswer = req.body.applicantNames

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.applicantNamesTempAnswer = req.body.applicantNames || "changeName"
        }
        if(!req.session.myData.applicantNamesTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantNamesAnswer = {
                "anchor": "",
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/applicant-names', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.applicantNames = req.session.myData.applicantNamesTempAnswer
            req.session.myData.applicantNamesTempAnswer = ""

            if(req.session.myData.applicantNames == "changeName"){
                //Start new one
                req.session.myData.selectedApplication.applicantName = ""
                req.session.myData.selectedApplication.applicantHasCompany = ""
                req.session.myData.selectedApplication.applicantEmail = ""
                req.session.myData.selectedApplication.applicantCompany = ""
                req.session.myData.selectedApplication.applicantAddress = ""
                res.redirect(301, '/' + version + '/applicant-name');
            } else {

                req.session.myData.selectedApplication.applicantName = req.session.myData.applicantNames
                
                var _existingApplicant = req.session.myData.applicants.find(obj => {return obj.name.toString() === req.session.myData.selectedApplication.applicantName.toString()});

                if(_existingApplicant){
                    req.session.myData.selectedApplicant = _existingApplicant
                }

                if(req.session.myData.selectedApplicant.companies.length > 0){
                    // go to new applicant company list is 1 or more saved companies on this user
                    res.redirect(301, '/' + version + '/applicant-companies');
                } else {
                    res.redirect(301, '/' + version + '/applicant-company');
                }
                
            }
            
        }
    });

    //Applicant name
    router.get('/' + version + '/applicant-name', function (req, res) {
        res.render(version + '/applicant-name', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-name', function (req, res) {

        req.session.myData.applicantNameAnswer = req.body.applicantName

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.applicantNameAnswer = req.session.myData.applicantNameAnswer || "Jane Doe"
        }

        if(!req.session.myData.applicantNameAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantName = {
                "anchor": "applicantName",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/applicant-name', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.applicantName = req.session.myData.applicantNameAnswer

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-applicant');
            } else {
                res.redirect(301, '/' + version + '/applicant-company');
            }

        }
        
    });

    // Applicant companies
    router.get('/' + version + '/applicant-companies', function (req, res) {
        res.render(version + '/applicant-companies', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-companies', function (req, res) {

        req.session.myData.applicantCompaniesTempAnswer = req.body.applicantCompanies

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.applicantCompaniesTempAnswer = req.body.applicantCompanies || "changeCompany"
        }
        if(!req.session.myData.applicantCompaniesTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantCompaniesAnswer = {
                "anchor": "",
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/applicant-companies', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.applicantCompanies = req.session.myData.applicantCompaniesTempAnswer
            req.session.myData.applicantCompaniesTempAnswer = ""

            var _cyaQS = ""
            if(req.query.cya == "true"){
                _cyaQS = "?cya=true"
            }

            if(req.session.myData.applicantCompanies == "changeCompany"){
                res.redirect(301, '/' + version + '/applicant-company' + _cyaQS);
            } else {
                req.session.myData.selectedApplication.applicantHasCompany = "Yes" 
                req.session.myData.selectedApplication.applicantCompany = req.session.myData.applicantCompanies
                if(req.query.cya == "true"){
                    res.redirect(301, '/' + version + '/cya-applicant');
                } else {
                    res.redirect(301, '/' + version + '/applicant-emails');
                }
            }
            
        }
    });

    // Applicant company
    router.get('/' + version + '/applicant-company', function (req, res) {
        res.render(version + '/applicant-company', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-company', function (req, res) {

        req.session.myData.applicantHasCompanyTempAnswer = req.body.applicantHasCompany
        req.session.myData.applicantCompanyTempAnswer = req.body.applicantCompany

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.applicantHasCompanyTempAnswer = req.session.myData.applicantHasCompanyTempAnswer || "Yes"
            req.session.myData.applicantCompanyTempAnswer = req.session.myData.applicantCompanyTempAnswer || "COMPANY NAME 2 LTD"
        }

        if(!req.session.myData.applicantHasCompanyTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantHasCompany = {
                "anchor": "applicantHasCompany",
                "message": "[error message 1]"
            }
        }
        if(req.session.myData.applicantHasCompanyTempAnswer == "Yes" && !req.session.myData.applicantCompanyTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantCompany = {
                "anchor": "applicantCompany",
                "message": "[error message 2]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/applicant-company', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.applicantHasCompany = req.session.myData.applicantHasCompanyTempAnswer 
            req.session.myData.selectedApplication.applicantCompany = req.session.myData.applicantCompanyTempAnswer

            req.session.myData.applicantHasCompanyTempAnswer = ""
            req.session.myData.applicantCompanyTempAnswer = ""

            // redirect to address list if using an existing applicant name
            var _existingApplicant = req.session.myData.applicants.find(obj => {return obj.name.toString() === req.session.myData.selectedApplication.applicantName.toString()});

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-applicant');
            } else {
                if(req.session.myData.selectedApplication.userIsApplicant == "Yes" || _existingApplicant){
                    // go to new applicant email list is 1 or more saved emails on this user
                    res.redirect(301, '/' + version + '/applicant-emails');
                } else {
                    res.redirect(301, '/' + version + '/applicant-email');
                }
            }

        }

    });

    // Applicant emails
    router.get('/' + version + '/applicant-emails', function (req, res) {
        res.render(version + '/applicant-emails', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-emails', function (req, res) {

        req.session.myData.applicantEmailsTempAnswer = req.body.applicantEmails

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.applicantEmailsTempAnswer = req.body.applicantEmails || "changeEmail"
        }
        if(!req.session.myData.applicantEmailsTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantEmailsAnswer = {
                "anchor": "",
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/applicant-emails', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.applicantEmails = req.session.myData.applicantEmailsTempAnswer
            req.session.myData.applicantEmailsTempAnswer = ""

            var _cyaQS = ""
            if(req.query.cya == "true"){
                _cyaQS = "?cya=true"
            }

            if(req.session.myData.applicantEmails == "changeEmail"){
                res.redirect(301, '/' + version + '/applicant-email' + _cyaQS);
            } else {
                req.session.myData.selectedApplication.applicantEmail = req.session.myData.applicantEmails
                if(req.query.cya == "true"){
                    res.redirect(301, '/' + version + '/cya-applicant');
                } else {
                    res.redirect(301, '/' + version + '/applicant-addresses');
                }
            }
            
        }
    });

    // Applicant email
    router.get('/' + version + '/applicant-email', function (req, res) {
        res.render(version + '/applicant-email', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-email', function (req, res) {

        req.session.myData.applicantEmailTempAnswer = req.body.applicantEmail

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.applicantEmailTempAnswer = req.session.myData.applicantEmailTempAnswer || "name@email.com"
        }

        if(!req.session.myData.applicantEmailTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantEmail = {
                "anchor": "applicantEmail",
                "message": "[error message 2]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/applicant-email', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.applicantEmail = req.session.myData.applicantEmailTempAnswer
            req.session.myData.applicantEmailTempAnswer = ""

            // redirect to address list if using an existing applicant name
            var _existingApplicant = req.session.myData.applicants.find(obj => {return obj.name.toString() === req.session.myData.selectedApplication.applicantName.toString()});

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-applicant');
            } else {
                if(req.session.myData.selectedApplication.userIsApplicant == "Yes" || _existingApplicant){
                    res.redirect(301, '/' + version + '/applicant-addresses');
                } else {
                    res.redirect(301, '/' + version + '/applicant-postcode');
                }
            }

        }

    });

    //Applicant postcode
    router.get('/' + version + '/applicant-postcode', function (req, res) {
        res.render(version + '/applicant-postcode', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-postcode', function (req, res) {

        req.session.myData.applicantPostcodeAnswer = req.body.applicantPostcode

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.applicantPostcodeAnswer = req.session.myData.applicantPostcodeAnswer || "B1 1AA"
        }

        if(!req.session.myData.applicantPostcodeAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantPostcode = {
                "anchor": "applicantPostcode",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/applicant-postcode', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            //changed postcode? if so - clear address fields
            if(req.session.myData.applicantPostcodeAnswer != req.session.myData.selectedApplication.applicantPostcode){
                req.session.myData.selectedApplication.applicantAddress = ""
                req.session.myData.selectedApplication.applicantAddress1 = ""
                req.session.myData.selectedApplication.applicantAddress2 = ""
                req.session.myData.selectedApplication.applicantAddress3 = ""
                req.session.myData.selectedApplication.applicantAddress4 = ""
            }

            req.session.myData.selectedApplication.applicantPostcode = req.session.myData.applicantPostcodeAnswer
            req.session.myData.selectedApplication.applicantHasPostcode = "true"

            res.redirect(301, '/' + version + '/applicant-address');

        }
        
    });

    // Applicant addresses
    router.get('/' + version + '/applicant-addresses', function (req, res) {
        res.render(version + '/applicant-addresses', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-addresses', function (req, res) {

        req.session.myData.applicantAddressesTempAnswer = req.body.applicantAddresses

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.applicantAddressesTempAnswer = req.body.applicantAddresses || "changeAddress"
        }
        if(!req.session.myData.applicantAddressesTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantAddressesAnswer = {
                "anchor": "",
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/applicant-addresses', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.applicantAddresses = req.session.myData.applicantAddressesTempAnswer
            req.session.myData.applicantAddressesTempAnswer = ""

            if(req.session.myData.applicantAddresses == "changeAddress"){

                req.session.myData.selectedApplication.applicantAddress = ""
                req.session.myData.selectedApplication.applicantAddress1 = ""
                req.session.myData.selectedApplication.applicantAddress2 = ""
                req.session.myData.selectedApplication.applicantAddress3 = ""
                req.session.myData.selectedApplication.applicantAddress4 = ""
                req.session.myData.selectedApplication.applicantHasPostcode = "false"
                req.session.myData.selectedApplication.applicantPostcode = ""

                res.redirect(301, '/' + version + '/applicant-postcode');
            } else {

                req.session.myData.selectedApplication.applicantAddress = req.session.myData.applicantAddresses

                // find selected address in selectedApplicant addresses
                var _existingAddress = req.session.myData.selectedApplicant.addresses.find(obj => {return obj.address1.toString() === req.session.myData.selectedApplication.applicantAddress.toString()});

                if(_existingAddress){
                    // then set each specific field
                    req.session.myData.selectedApplication.applicantAddress1 = req.session.myData.applicantAddresses
                    req.session.myData.selectedApplication.applicantAddress2 = _existingAddress.address2 //optional = address2
                    req.session.myData.selectedApplication.applicantAddress3 = _existingAddress.address3 // = address3
                    req.session.myData.selectedApplication.applicantAddress4 = _existingAddress.address4 // = address4
                    if(_existingAddress.postcode == ""){
                        req.session.myData.selectedApplication.applicantHasPostcode = "true"
                    } else {
                        req.session.myData.selectedApplication.applicantHasPostcode = "false"
                    }
                    req.session.myData.selectedApplication.applicantPostcode = _existingAddress.postcode //optional "" or postcode
                }

                res.redirect(301, '/' + version + '/cya-applicant');
            }
            
        }
    });

    // Applicant address
    router.get('/' + version + '/applicant-address', function (req, res) {
        res.render(version + '/applicant-address', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-address', function (req, res) {

        req.session.myData.applicantAddressTempAnswer = req.body.applicantAddress

        if(req.session.myData.includeValidation == "false"){
            if(req.session.myData.applicantAddressTempAnswer == "select"){
                req.session.myData.applicantAddressTempAnswer = "1 High Street"
            } else {
                req.session.myData.applicantAddressTempAnswer = req.session.myData.applicantAddressTempAnswer || "1 High Street"
            }
        }
        if(req.session.myData.applicantAddressTempAnswer == "select"){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantAddress = {
                "anchor": "applicantAddress",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/applicant-address', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.applicantAddress = req.session.myData.applicantAddressTempAnswer
            req.session.myData.applicantAddressTempAnswer = ""

            req.session.myData.selectedApplication.applicantAddress1 = req.session.myData.selectedApplication.applicantAddress
            req.session.myData.selectedApplication.applicantAddress2 = ""
            req.session.myData.selectedApplication.applicantAddress3 = "Oxford"
            req.session.myData.selectedApplication.applicantAddress4 = "Oxfordshire"

            res.redirect(301, '/' + version + '/cya-applicant');

        }

    });

    // Applicant address
    router.get('/' + version + '/applicant-address-form', function (req, res) {
        if(req.query.applicantHasPostcode == "false"){
            req.session.myData.selectedApplication.applicantHasPostcode = "false"
        }
        res.render(version + '/applicant-address-form', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-address-form', function (req, res) {

        req.session.myData.applicantAddress1TempAnswer = req.body.applicantAddress1
        req.session.myData.applicantAddress2TempAnswer = req.body.applicantAddress2
        req.session.myData.applicantAddress3TempAnswer = req.body.applicantAddress3
        req.session.myData.applicantAddress4TempAnswer = req.body.applicantAddress4
        if(req.session.myData.selectedApplication.applicantHasPostcode != "false"){
            req.session.myData.applicantPostcodeTempAnswer = req.body.applicantPostcode
        } else {
            req.session.myData.applicantPostcodeTempAnswer = ""
        }

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.applicantAddress1TempAnswer = req.session.myData.applicantAddress1TempAnswer || "1 High Street"
            req.session.myData.applicantAddress2TempAnswer = req.session.myData.applicantAddress2TempAnswer || ""
            req.session.myData.applicantAddress3TempAnswer = req.session.myData.applicantAddress3TempAnswer || "Oxford"
            req.session.myData.applicantAddress4TempAnswer = req.session.myData.applicantAddress4TempAnswer || "Oxfordshire"
            if(req.session.myData.selectedApplication.applicantHasPostcode != "false"){
                req.session.myData.applicantPostcodeTempAnswer = req.session.myData.applicantPostcodeTempAnswer || "B1 1AA"
            }
        }

        if(!req.session.myData.applicantAddress1TempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantAddress1 = {
                "anchor": "applicantAddress1",
                "message": "[error message 1]"
            }
        }
        if(!req.session.myData.applicantAddress3TempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantAddress3 = {
                "anchor": "applicantAddress3",
                "message": "[error message 3]"
            }
        }
        if(!req.session.myData.applicantAddress4TempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.applicantAddress4 = {
                "anchor": "applicantAddress4",
                "message": "[error message 4]"
            }
        }
        if(req.session.myData.selectedApplication.applicantHasPostcode != "false"){
            if(!req.session.myData.applicantPostcodeTempAnswer){
                req.session.myData.validationError = "true"
                req.session.myData.validationErrors.applicantPostcode = {
                    "anchor": "applicantPostcode",
                    "message": "[error message 5]"
                }
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/applicant-address-form', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.applicantAddress = req.session.myData.applicantAddress1TempAnswer

            req.session.myData.selectedApplication.applicantAddress1 = req.session.myData.applicantAddress1TempAnswer
            req.session.myData.selectedApplication.applicantAddress2 = req.session.myData.applicantAddress2TempAnswer
            req.session.myData.selectedApplication.applicantAddress3 = req.session.myData.applicantAddress3TempAnswer
            req.session.myData.selectedApplication.applicantAddress4 = req.session.myData.applicantAddress4TempAnswer
            req.session.myData.selectedApplication.applicantPostcode = req.session.myData.applicantPostcodeTempAnswer

            req.session.myData.applicantAddress1TempAnswer = ""
            req.session.myData.applicantAddress2TempAnswer = ""
            req.session.myData.applicantAddress3TempAnswer = ""
            req.session.myData.applicantAddress4TempAnswer = ""
            req.session.myData.applicantPostcodeTempAnswer = ""

            res.redirect(301, '/' + version + '/cya-applicant');

        }

    });

    // Check your answers applicant
    router.get('/' + version + '/cya-applicant', function (req, res) {
        res.render(version + '/cya-applicant', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-applicant', function (req, res) {

        updateLastSavedDate(req,req.session.myData.selectedApplication)

        var _existingApplicant = req.session.myData.applicants.find(obj => {return obj.name.toString() === req.session.myData.selectedApplication.applicantName.toString()});

        var _newAddress = {
            "address1": req.session.myData.selectedApplication.applicantAddress1,
            "address2": req.session.myData.selectedApplication.applicantAddress2,
            "address3": req.session.myData.selectedApplication.applicantAddress3,
            "address4": req.session.myData.selectedApplication.applicantAddress4,
            "postcode": req.session.myData.selectedApplication.applicantPostcode,
        },
        _newCompany = {
            "company": req.session.myData.selectedApplication.applicantCompany
        }

        if(req.session.myData.selectedApplication.userIsApplicant == "Yes"){
            //user is the applicant
            //Add new company
            if(req.session.myData.selectedApplication.applicantHasCompany == "Yes" && req.session.myData.applicantCompanies == "changeCompany"){
                req.session.myData.user.companies.push(_newCompany)
                //Sort companies
                req.session.myData.user.companies.sort(function(a,b){
                    var returnValue = a.company.toString().toUpperCase() > b.company.toString().toUpperCase() ? 1 : b.company.toString().toUpperCase() > a.company.toString().toUpperCase() ? -1 : 0;
                    return returnValue;
                })
            }
            //Add new address
            if(req.session.myData.applicantAddresses == "changeAddress"){
                req.session.myData.user.addresses.unshift(_newAddress)
            }
        } else if(_existingApplicant){
            //existing applicant
            //Add new company
            if(req.session.myData.selectedApplication.applicantHasCompany == "Yes" && req.session.myData.applicantCompanies == "changeCompany"){
                _existingApplicant.companies.push(_newCompany)
                //Sort companies
                _existingApplicant.companies.sort(function(a,b){
                    var returnValue = a.company.toString().toUpperCase() > b.company.toString().toUpperCase() ? 1 : b.company.toString().toUpperCase() > a.company.toString().toUpperCase() ? -1 : 0;
                    return returnValue;
                })
            }
            //Add new address
            if(req.session.myData.applicantAddresses == "changeAddress"){
                _existingApplicant.addresses.unshift(_newAddress)
            }
        } else {
            //add new applicant
            var _newApplicant = {
                "name": req.session.myData.selectedApplication.applicantName,
                "companies": [],
                addresses: [
                    _newAddress
                ]
            }
            if(req.session.myData.selectedApplication.applicantHasCompany == "Yes"){
                _newApplicant.companies.push(_newCompany)
            }
            req.session.myData.applicants.push(_newApplicant)
            //Sort applicants
            req.session.myData.applicants.sort(function(a,b){
                var returnValue = a.name.toString().toUpperCase() > b.name.toString().toUpperCase() ? 1 : b.name.toString().toUpperCase() > a.name.toString().toUpperCase() ? -1 : 0;
                return returnValue;
            })
        }

        req.session.myData.selectedApplication.tasklist.sections["5"] = "completed"
        updateTasklist(req)
        res.redirect(301, '/' + version + '/tasklist');
        
    });

    // Ecologist - user
    router.get('/' + version + '/ecologist-user', function (req, res) {
        req.session.myData.selectedApplication.tasklist.sections["6"] = "inprogress"
        res.render(version + '/ecologist-user', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/ecologist-user', function (req, res) {

        var _was = req.session.myData.selectedApplication.userIsEcologist

        req.session.myData.userIsEcologistAnswer = req.body.userIsEcologist

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.userIsEcologistAnswer = req.session.myData.userIsEcologistAnswer || "No"
        }

        if(!req.session.myData.userIsEcologistAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.userIsEcologist = {
                "anchor": "userIsEcologist-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/ecologist-user', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.userIsEcologist = req.session.myData.userIsEcologistAnswer

            if(req.session.myData.selectedApplication.userIsEcologist == "Yes"){
                req.session.myData.selectedEcologist = req.session.myData.user
                req.session.myData.selectedApplication.ecologistName = req.session.myData.user.userName
            } else {
                // req.session.myData.selectedApplication.ecologistName = ""
            }

            //if came from change yes/no

            if(_was == req.session.myData.selectedApplication.userIsEcologist && req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-ecologist');
            
            } else {

                if(req.session.myData.selectedApplication.userIsEcologist == "No"){
                    if(req.session.myData.ecologists.length > 0){
                        // go to new ecologist name list is 1 or more saved ecologists
                        res.redirect(301, '/' + version + '/ecologist-names');
                    } else {
                        res.redirect(301, '/' + version + '/ecologist-name');
                    }
                } else {
                    if(req.session.myData.user.companies.length > 0){
                        // go to new ecologist company list is 1 or more saved companies on this user
                        res.redirect(301, '/' + version + '/ecologist-companies');
                    } else {
                        res.redirect(301, '/' + version + '/ecologist-company');
                    }
                }
            }

        }
        
    });

     // Ecologist names
     router.get('/' + version + '/ecologist-names', function (req, res) {
        res.render(version + '/ecologist-names', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/ecologist-names', function (req, res) {

        req.session.myData.ecologistNamesTempAnswer = req.body.ecologistNames

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.ecologistNamesTempAnswer = req.body.ecologistNames || "changeName"
        }
        if(!req.session.myData.ecologistNamesTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistNamesAnswer = {
                "anchor": "",
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/ecologist-names', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.ecologistNames = req.session.myData.ecologistNamesTempAnswer
            req.session.myData.ecologistNamesTempAnswer = ""

            if(req.session.myData.ecologistNames == "changeName"){
                //Start new one
                req.session.myData.selectedApplication.ecologistName = ""
                req.session.myData.selectedApplication.ecologistHasCompany = ""
                req.session.myData.selectedApplication.ecologistCompany = ""
                req.session.myData.selectedApplication.ecologistEmail = ""
                req.session.myData.selectedApplication.ecologistAddress = ""
                res.redirect(301, '/' + version + '/ecologist-name');
            } else {

                req.session.myData.selectedApplication.ecologistName = req.session.myData.ecologistNames
                
                var _existingEcologist = req.session.myData.ecologists.find(obj => {return obj.name.toString() === req.session.myData.selectedApplication.ecologistName.toString()});

                if(_existingEcologist){
                    req.session.myData.selectedEcologist = _existingEcologist
                }

                if(req.session.myData.selectedEcologist.companies.length > 0){
                    // go to new ecologist company list is 1 or more saved companies on this user
                    res.redirect(301, '/' + version + '/ecologist-companies');
                } else {
                    res.redirect(301, '/' + version + '/ecologist-company');
                }
                
            }
            
        }
    });

    //Ecologist name
    router.get('/' + version + '/ecologist-name', function (req, res) {
        res.render(version + '/ecologist-name', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/ecologist-name', function (req, res) {

        req.session.myData.ecologistNameAnswer = req.body.ecologistName

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.ecologistNameAnswer = req.session.myData.ecologistNameAnswer || "Jane Doe"
        }

        if(!req.session.myData.ecologistNameAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistName = {
                "anchor": "ecologistName",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/ecologist-name', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.ecologistName = req.session.myData.ecologistNameAnswer

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-ecologist');
            } else {
                res.redirect(301, '/' + version + '/ecologist-company');
            }

        }
        
    });

    // Ecologist companies
    router.get('/' + version + '/ecologist-companies', function (req, res) {
        res.render(version + '/ecologist-companies', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/ecologist-companies', function (req, res) {

        req.session.myData.ecologistCompaniesTempAnswer = req.body.ecologistCompanies

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.ecologistCompaniesTempAnswer = req.body.ecologistCompanies || "changeCompany"
        }
        if(!req.session.myData.ecologistCompaniesTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistCompaniesAnswer = {
                "anchor": "",
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/ecologist-companies', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.ecologistCompanies = req.session.myData.ecologistCompaniesTempAnswer
            req.session.myData.ecologistCompaniesTempAnswer = ""

            var _cyaQS = ""
            if(req.query.cya == "true"){
                _cyaQS = "?cya=true"
            }

            if(req.session.myData.ecologistCompanies == "changeCompany"){
                res.redirect(301, '/' + version + '/ecologist-company' + _cyaQS);
            } else {
                req.session.myData.selectedApplication.ecologistHasCompany = "Yes" 
                req.session.myData.selectedApplication.ecologistCompany = req.session.myData.ecologistCompanies
                if(req.query.cya == "true"){
                    res.redirect(301, '/' + version + '/cya-ecologist');
                } else {
                    res.redirect(301, '/' + version + '/ecologist-emails');
                }
            }
            
        }
    });

    // Ecologist company
    router.get('/' + version + '/ecologist-company', function (req, res) {
        res.render(version + '/ecologist-company', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/ecologist-company', function (req, res) {

        req.session.myData.ecologistHasCompanyTempAnswer = req.body.ecologistHasCompany
        req.session.myData.ecologistCompanyTempAnswer = req.body.ecologistCompany

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.ecologistHasCompanyTempAnswer = req.session.myData.ecologistHasCompanyTempAnswer || "Yes"
            req.session.myData.ecologistCompanyTempAnswer = req.session.myData.ecologistCompanyTempAnswer || "COMPANY NAME 2 LTD"
        }

        if(!req.session.myData.ecologistHasCompanyTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistHasCompany = {
                "anchor": "ecologistHasCompany",
                "message": "[error message 1]"
            }
        }
        if(req.session.myData.ecologistHasCompanyTempAnswer == "Yes" && !req.session.myData.ecologistCompanyTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistCompany = {
                "anchor": "ecologistCompany",
                "message": "[error message 2]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/ecologist-company', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.ecologistHasCompany = req.session.myData.ecologistHasCompanyTempAnswer 
            req.session.myData.selectedApplication.ecologistCompany = req.session.myData.ecologistCompanyTempAnswer

            req.session.myData.ecologistHasCompanyTempAnswer = ""
            req.session.myData.ecologistCompanyTempAnswer = ""

            // redirect to address list if using an existing ecologist name
            var _existingEcologist = req.session.myData.ecologists.find(obj => {return obj.name.toString() === req.session.myData.selectedApplication.ecologistName.toString()});

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-ecologist');
            } else {
                if(req.session.myData.selectedApplication.userIsEcologist == "Yes" || _existingEcologist){
                    // go to new ecologist email list is 1 or more saved emails on this user
                    res.redirect(301, '/' + version + '/ecologist-emails');
                } else {
                    res.redirect(301, '/' + version + '/ecologist-email');
                }
            }

        }

    });

    // Ecologist emails
    router.get('/' + version + '/ecologist-emails', function (req, res) {
        res.render(version + '/ecologist-emails', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/ecologist-emails', function (req, res) {

        req.session.myData.ecologistEmailsTempAnswer = req.body.ecologistEmails

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.ecologistEmailsTempAnswer = req.body.ecologistEmails || "changeEmail"
        }
        if(!req.session.myData.ecologistEmailsTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistEmailsAnswer = {
                "anchor": "",
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/ecologist-emails', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.ecologistEmails = req.session.myData.ecologistEmailsTempAnswer
            req.session.myData.ecologistEmailsTempAnswer = ""

            var _cyaQS = ""
            if(req.query.cya == "true"){
                _cyaQS = "?cya=true"
            }

            if(req.session.myData.ecologistEmails == "changeEmail"){
                res.redirect(301, '/' + version + '/ecologist-email' + _cyaQS);
            } else {
                req.session.myData.selectedApplication.ecologistEmail = req.session.myData.ecologistEmails
                if(req.query.cya == "true"){
                    res.redirect(301, '/' + version + '/cya-ecologist');
                } else {
                    res.redirect(301, '/' + version + '/ecologist-addresses');
                }
            }
            
        }
    });

    // Ecologist email
    router.get('/' + version + '/ecologist-email', function (req, res) {
        res.render(version + '/ecologist-email', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/ecologist-email', function (req, res) {

        req.session.myData.ecologistEmailTempAnswer = req.body.ecologistEmail

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.ecologistEmailTempAnswer = req.session.myData.ecologistEmailTempAnswer || "name@email.com"
        }

        if(!req.session.myData.ecologistEmailTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistEmail = {
                "anchor": "ecologistEmail",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/ecologist-email', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.ecologistEmail = req.session.myData.ecologistEmailTempAnswer
            req.session.myData.ecologistEmailTempAnswer = ""

            // redirect to address list if using an existing ecologist name
            var _existingEcologist = req.session.myData.ecologists.find(obj => {return obj.name.toString() === req.session.myData.selectedApplication.ecologistName.toString()});

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-ecologist');
            } else {
                if(req.session.myData.selectedApplication.userIsEcologist == "Yes" || _existingEcologist){
                    res.redirect(301, '/' + version + '/ecologist-addresses');
                } else {
                    res.redirect(301, '/' + version + '/ecologist-postcode');
                }
            }

        }

    });

    // Ecologist addresses
    router.get('/' + version + '/ecologist-addresses', function (req, res) {
        res.render(version + '/ecologist-addresses', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/ecologist-addresses', function (req, res) {

        req.session.myData.ecologistAddressesTempAnswer = req.body.ecologistAddresses

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.ecologistAddressesTempAnswer = req.body.ecologistAddresses || "changeAddress"
        }
        if(!req.session.myData.ecologistAddressesTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistAddressesAnswer = {
                "anchor": "",
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/ecologist-addresses', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.ecologistAddresses = req.session.myData.ecologistAddressesTempAnswer
            req.session.myData.ecologistAddressesTempAnswer = ""

            if(req.session.myData.ecologistAddresses == "changeAddress"){

                req.session.myData.selectedApplication.ecologistAddress = ""
                req.session.myData.selectedApplication.ecologistAddress1 = ""
                req.session.myData.selectedApplication.ecologistAddress2 = ""
                req.session.myData.selectedApplication.ecologistAddress3 = ""
                req.session.myData.selectedApplication.ecologistAddress4 = ""
                req.session.myData.selectedApplication.ecologistHasPostcode = "false"
                req.session.myData.selectedApplication.ecologistPostcode = ""

                res.redirect(301, '/' + version + '/ecologist-postcode');
            } else {

                req.session.myData.selectedApplication.ecologistAddress = req.session.myData.ecologistAddresses

                // find selected address in selectedEcologist addresses
                var _existingAddress = req.session.myData.selectedEcologist.addresses.find(obj => {return obj.address1.toString() === req.session.myData.selectedApplication.ecologistAddress.toString()});

                if(_existingAddress){
                    // then set each specific field
                    req.session.myData.selectedApplication.ecologistAddress1 = req.session.myData.ecologistAddresses
                    req.session.myData.selectedApplication.ecologistAddress2 = _existingAddress.address2 //optional = address2
                    req.session.myData.selectedApplication.ecologistAddress3 = _existingAddress.address3 // = address3
                    req.session.myData.selectedApplication.ecologistAddress4 = _existingAddress.address4 // = address4
                    if(_existingAddress.postcode == ""){
                        req.session.myData.selectedApplication.ecologistHasPostcode = "true"
                    } else {
                        req.session.myData.selectedApplication.ecologistHasPostcode = "false"
                    }
                    req.session.myData.selectedApplication.ecologistPostcode = _existingAddress.postcode //optional "" or postcode
                }

                res.redirect(301, '/' + version + '/cya-ecologist');
            }
            
        }
    });

    //Ecologist postcode
    router.get('/' + version + '/ecologist-postcode', function (req, res) {
        res.render(version + '/ecologist-postcode', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/ecologist-postcode', function (req, res) {

        req.session.myData.ecologistPostcodeAnswer = req.body.ecologistPostcode

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.ecologistPostcodeAnswer = req.session.myData.ecologistPostcodeAnswer || "B1 1AA"
        }

        if(!req.session.myData.ecologistPostcodeAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistPostcode = {
                "anchor": "ecologistPostcode",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/ecologist-postcode', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            //changed postcode? if so - clear address fields
            if(req.session.myData.ecologistPostcodeAnswer != req.session.myData.selectedApplication.ecologistPostcode){
                req.session.myData.selectedApplication.ecologistAddress = ""
                req.session.myData.selectedApplication.ecologistAddress1 = ""
                req.session.myData.selectedApplication.ecologistAddress2 = ""
                req.session.myData.selectedApplication.ecologistAddress3 = ""
                req.session.myData.selectedApplication.ecologistAddress4 = ""
            }

            req.session.myData.selectedApplication.ecologistPostcode = req.session.myData.ecologistPostcodeAnswer
            req.session.myData.selectedApplication.ecologistHasPostcode = "true"

            res.redirect(301, '/' + version + '/ecologist-address');

        }
        
    });

    // Ecologist address
    router.get('/' + version + '/ecologist-address', function (req, res) {
        res.render(version + '/ecologist-address', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/ecologist-address', function (req, res) {

        req.session.myData.ecologistAddressTempAnswer = req.body.ecologistAddress

        if(req.session.myData.includeValidation == "false"){
            if(req.session.myData.ecologistAddressTempAnswer == "select"){
                req.session.myData.ecologistAddressTempAnswer = "1 High Street"
            } else {
                req.session.myData.ecologistAddressTempAnswer = req.session.myData.ecologistAddressTempAnswer || "1 High Street"
            }
        }
        if(req.session.myData.ecologistAddressTempAnswer == "select"){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistAddress = {
                "anchor": "ecologistAddress",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/ecologist-address', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.ecologistAddress = req.session.myData.ecologistAddressTempAnswer
            req.session.myData.ecologistAddressTempAnswer = ""

            req.session.myData.selectedApplication.ecologistAddress1 = req.session.myData.selectedApplication.ecologistAddress
            req.session.myData.selectedApplication.ecologistAddress2 = ""
            req.session.myData.selectedApplication.ecologistAddress3 = "Oxford"
            req.session.myData.selectedApplication.ecologistAddress4 = "Oxfordshire"

            res.redirect(301, '/' + version + '/cya-ecologist');

        }

    });

    // Ecologist address
    router.get('/' + version + '/ecologist-address-form', function (req, res) {
        if(req.query.ecologistHasPostcode == "false"){
            req.session.myData.selectedApplication.ecologistHasPostcode = "false"
        }
        res.render(version + '/ecologist-address-form', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/ecologist-address-form', function (req, res) {

        req.session.myData.ecologistAddress1TempAnswer = req.body.ecologistAddress1
        req.session.myData.ecologistAddress2TempAnswer = req.body.ecologistAddress2
        req.session.myData.ecologistAddress3TempAnswer = req.body.ecologistAddress3
        req.session.myData.ecologistAddress4TempAnswer = req.body.ecologistAddress4
        if(req.session.myData.selectedApplication.ecologistHasPostcode != "false"){
            req.session.myData.ecologistPostcodeTempAnswer = req.body.ecologistPostcode
        } else {
            req.session.myData.ecologistPostcodeTempAnswer = ""
        }

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.ecologistAddress1TempAnswer = req.session.myData.ecologistAddress1TempAnswer || "1 High Street"
            req.session.myData.ecologistAddress2TempAnswer = req.session.myData.ecologistAddress2TempAnswer || ""
            req.session.myData.ecologistAddress3TempAnswer = req.session.myData.ecologistAddress3TempAnswer || "Oxford"
            req.session.myData.ecologistAddress4TempAnswer = req.session.myData.ecologistAddress4TempAnswer || "Oxfordshire"
            if(req.session.myData.selectedApplication.ecologistHasPostcode != "false"){
                req.session.myData.ecologistPostcodeTempAnswer = req.session.myData.ecologistPostcodeTempAnswer || "B1 1AA"
            }
        }

        if(!req.session.myData.ecologistAddress1TempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistAddress1 = {
                "anchor": "ecologistAddress1",
                "message": "[error message 1]"
            }
        }
        if(!req.session.myData.ecologistAddress3TempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistAddress3 = {
                "anchor": "ecologistAddress3",
                "message": "[error message 3]"
            }
        }
        if(!req.session.myData.ecologistAddress4TempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.ecologistAddress4 = {
                "anchor": "ecologistAddress4",
                "message": "[error message 4]"
            }
        }
        if(req.session.myData.selectedApplication.ecologistHasPostcode != "false"){
            if(!req.session.myData.ecologistPostcodeTempAnswer){
                req.session.myData.validationError = "true"
                req.session.myData.validationErrors.ecologistPostcode = {
                    "anchor": "ecologistPostcode",
                    "message": "[error message 5]"
                }
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/ecologist-address-form', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.ecologistAddress = req.session.myData.ecologistAddress1TempAnswer

            req.session.myData.selectedApplication.ecologistAddress1 = req.session.myData.ecologistAddress1TempAnswer
            req.session.myData.selectedApplication.ecologistAddress2 = req.session.myData.ecologistAddress2TempAnswer
            req.session.myData.selectedApplication.ecologistAddress3 = req.session.myData.ecologistAddress3TempAnswer
            req.session.myData.selectedApplication.ecologistAddress4 = req.session.myData.ecologistAddress4TempAnswer
            req.session.myData.selectedApplication.ecologistPostcode = req.session.myData.ecologistPostcodeTempAnswer

            req.session.myData.ecologistAddress1TempAnswer = ""
            req.session.myData.ecologistAddress2TempAnswer = ""
            req.session.myData.ecologistAddress3TempAnswer = ""
            req.session.myData.ecologistAddress4TempAnswer = ""
            req.session.myData.ecologistPostcodeTempAnswer = ""

            res.redirect(301, '/' + version + '/cya-ecologist');

        }

    });

    // Check your answers ecologist
    router.get('/' + version + '/cya-ecologist', function (req, res) {
        res.render(version + '/cya-ecologist', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-ecologist', function (req, res) {

        updateLastSavedDate(req,req.session.myData.selectedApplication)

        var _existingEcologist = req.session.myData.ecologists.find(obj => {return obj.name.toString() === req.session.myData.selectedApplication.ecologistName.toString()});

        var _newAddress = {
            "address1": req.session.myData.selectedApplication.ecologistAddress1,
            "address2": req.session.myData.selectedApplication.ecologistAddress2,
            "address3": req.session.myData.selectedApplication.ecologistAddress3,
            "address4": req.session.myData.selectedApplication.ecologistAddress4,
            "postcode": req.session.myData.selectedApplication.ecologistPostcode,
        },
        _newCompany = {
            "company": req.session.myData.selectedApplication.ecologistCompany
        }

        if(req.session.myData.selectedApplication.userIsEcologist == "Yes"){
            //user is the ecologist
            //Add new company
            if(req.session.myData.selectedApplication.ecologistHasCompany == "Yes" && req.session.myData.ecologistCompanies == "changeCompany"){
                req.session.myData.user.companies.push(_newCompany)
                //Sort companies
                req.session.myData.user.companies.sort(function(a,b){
                    var returnValue = a.company.toString().toUpperCase() > b.company.toString().toUpperCase() ? 1 : b.company.toString().toUpperCase() > a.company.toString().toUpperCase() ? -1 : 0;
                    return returnValue;
                })
            }
            //Add new address
            if(req.session.myData.ecologistAddresses == "changeAddress"){
                req.session.myData.user.addresses.unshift(_newAddress)
            }
        } else if(_existingEcologist){
            //existing ecologist
            //Add new company
            if(req.session.myData.selectedApplication.ecologistHasCompany == "Yes" && req.session.myData.ecologistCompanies == "changeCompany"){
                _existingEcologist.companies.push(_newCompany)
                //Sort companies
                _existingEcologist.companies.sort(function(a,b){
                    var returnValue = a.company.toString().toUpperCase() > b.company.toString().toUpperCase() ? 1 : b.company.toString().toUpperCase() > a.company.toString().toUpperCase() ? -1 : 0;
                    return returnValue;
                })
            }
            //Add new address
            if(req.session.myData.ecologistAddresses == "changeAddress"){
                _existingEcologist.addresses.unshift(_newAddress)
            }
        } else {
            //add new ecologist
            var _newEcologist = {
                "name": req.session.myData.selectedApplication.ecologistName,
                "companies": [],
                addresses: [
                    _newAddress
                ]
            }
            if(req.session.myData.selectedApplication.ecologistHasCompany == "Yes"){
                _newEcologist.companies.push(_newCompany)
            }
            req.session.myData.ecologists.push(_newEcologist)
            //Sort ecologists
            req.session.myData.ecologists.sort(function(a,b){
                var returnValue = a.name.toString().toUpperCase() > b.name.toString().toUpperCase() ? 1 : b.name.toString().toUpperCase() > a.name.toString().toUpperCase() ? -1 : 0;
                return returnValue;
            })
        }

        req.session.myData.selectedApplication.tasklist.sections["6"] = "completed"
        updateTasklist(req)
        res.redirect(301, '/' + version + '/tasklist');
        
    });

    //Work schedule upload
    router.get('/' + version + '/work-schedule-upload', function (req, res) {

        req.session.myData.selectedApplication.tasklist.sections["9"] = "inprogress"

        res.render(version + '/work-schedule-upload', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/work-schedule-upload', function (req, res) {

        req.session.myData.workScheduleUploadAnswer = req.body.workScheduleUpload

        // if(req.session.myData.includeValidation == "false"){
            req.session.myData.workScheduleUploadAnswer = req.session.myData.workScheduleUploadAnswer || "work-schedule.doc"
        // }

        // if(!req.session.myData.workScheduleUploadAnswer){
        //     req.session.myData.validationError = "true"
        //     req.session.myData.validationErrors.workScheduleUpload = {
        //         "anchor": "workScheduleUpload",
        //         "message": "[error message]"
        //     }
        // }

        // if(req.session.myData.validationError == "true") {
        //     res.render(version + '/work-site-upload', {
        //         myData: req.session.myData
        //     });
        // } else {
            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedApplication.workScheduleUpload = req.session.myData.workScheduleUploadAnswer
            req.session.myData.workScheduleUploadAnswer = ""

            res.redirect(301, '/' + version + '/cya-work-schedule');
        // }
        
    });

    //CYA Work schedule boundary
    router.get('/' + version + '/cya-work-schedule', function (req, res) {
        res.render(version + '/cya-work-schedule', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-work-schedule', function (req, res) {

        updateLastSavedDate(req,req.session.myData.selectedApplication)

        req.session.myData.selectedApplication.tasklist.sections["9"] = "completed"
        updateTasklist(req)

        res.redirect(301, '/' + version + '/tasklist');
    }); 

    // Applications list
    router.get('/' + version + '/applications', function (req, res) {

        if(req.query.justsaved == "true"){
            req.session.myData.notifications.type = "saved"
            req.session.myData.showNotification = "true"
        }

        req.session.myData.signedIn = "true"

        //Sort applications
        req.session.myData.applications.sort(function(a,b){

            var returnValue = 0;
    
            //Sort on status - INPROGRESS first
            if(a.status == "inprogress" && b.status != "inprogress") {
              returnValue = -1
            } else {
                //BOTH INPROGRESS
                if(a.status != "inprogress" && b.status == "inprogress") {
                    returnValue = 1
                } else {

                    //Sort on status - GRANTED first
                    if(a.status == "granted" && b.status != "granted") {
                        returnValue = -1
                    } else {
                        //BOTH GRANTED
                        if(a.status != "granted" && b.status == "granted") {
                            returnValue = 1
                        } else {

                            //Sort on valid to date - expires first (granted)
                            if(a.validtodate < b.validtodate){
                                returnValue = -1
                            } else {
                                if(b.validtodate < a.validtodate){
                                    returnValue = 1
                                } else {

                                    //Sort on last saved date (inprogress and submitted)
                                    if(a.lastsaveddate > b.lastsaveddate){
                                        returnValue = -1
                                    } else {
                                        if(b.lastsaveddate > a.lastsaveddate){
                                            returnValue = 1
                                        } else {
                                            // Then sort on first id value
                                            returnValue = a.id.toString().toUpperCase() > b.id.toString().toUpperCase() ? 1 : b.id.toString().toUpperCase() > a.id.toString().toUpperCase() ? -1 : 0;
                                        }
                                    }

                                }
                                
                            }

                        }
                    }
                }
            }
    
            return returnValue;
    
        })

        res.render(version + '/applications', {
            myData:req.session.myData
        });
    });

    // Application
    router.get('/' + version + '/application', function (req, res) {

        req.session.myData.signedIn = "true"

        res.render(version + '/application', {
            myData:req.session.myData
        });
    });

}