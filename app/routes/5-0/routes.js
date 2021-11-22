const e = require("express");

module.exports = function (router,_myData) {

    var version = "5-0";

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

    function addRoostToApplication(req,roost){
        roost.new = false
        roost.inprogress = false

        var _existingRoost = req.session.myData.selectedApplication.roosts.find(obj => {return obj.id.toString() === roost.id.toString()});
                    
        if(_existingRoost){
            //replace existing
            var _existingIndex = req.session.myData.selectedApplication.roosts.map(item => item.id.toString()).indexOf(roost.id.toString());
            req.session.myData.selectedApplication.roosts[_existingIndex] = roost;
        } else {
            // add new
            req.session.myData.selectedApplication.roosts.push(roost)
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

        if(_applicationID){

            var _existingApplication = req.session.myData.applications.find(obj => {return obj.id.toString() === _applicationID.toString()})

            if(_existingApplication){
                //Use existing application
                req.session.myData.selectedApplication = _existingApplication
            } else {
                //Start new application
                // if(!req.session.myData.newApplication.inprogress){
                //     req.session.myData.newApplication.inprogress = true
                    // req.session.myData.selectedApplication = req.session.myData.newApplication
                    // is this used?
                    req.session.myData.selectedApplication = req.session.myData.tempApplication
                // }
            }
            req.session.myData.application = req.session.myData.selectedApplication.id

            // for (var i = 0; i < req.session.myData.applications.length; i++) {
            //     var _thisApplication = req.session.myData.applications[i]
            //     if(_thisApplication.id.toString() == _applicationID.toString()){
            //         req.session.myData.selectedApplication = _thisApplication
            //         req.session.myData.application = _thisApplication.id
            //     }
            // }
        }

        setServiceName(req)

    }

    function startNewApplication(req){

        //Used until user passes eligibility
        req.session.myData.tempApplication = JSON.parse(JSON.stringify(req.session.myData.newApplication))

        var _year = new Date().getFullYear(),
            _randomID = Math.floor(10000 + Math.random() * 90000),
            _appID = _year + "-" + _randomID + "-EPS-MIT"

        req.session.myData.tempApplication.id = _appID
        req.session.myData.tempApplication.status = "inprogress"
        req.session.myData.tempApplication.type = req.session.myData.licenceType
        req.session.myData.tempApplication.starteddate = new Date()
        req.session.myData.tempApplication.lastsaveddate = new Date()

        //Add
        // req.session.myData.applications.push(JSON.parse(JSON.stringify(req.session.myData.tempApplication)))

        //Set
        // setSelectedApplication(req, _randomID)
        setSelectedApplication(req,req.session.myData.tempApplication)
        // req.session.myData.selectedApplication = req.session.myData.tempApplication
        // req.session.myData.application = _randomID

        //Add
        // req.session.myData.selectedApplication.new = false

        //Update tasklist data
        updateTasklist(req)
        
    }

    function setSelectedRoost(req, _roostID){

        if(_roostID){

            var _existingRoost = req.session.myData.selectedApplication.roosts.find(obj => {return obj.id.toString() === _roostID.toString()})

            //TODO fix it not thinking the currently added new one is existing

            if(_existingRoost){
                req.session.myData.selectedRoost = _existingRoost
            } else {
                if(req.session.myData.testdata == "true"){
                    req.session.myData.selectedRoost = req.session.myData.testRoost
                    addRoostToApplication(req,req.session.myData.selectedRoost)
                } else {
                    if(!req.session.myData.newRoost.inprogress){
                        req.session.myData.newRoost.inprogress = true
                        req.session.myData.selectedRoost = req.session.myData.newRoost
                    }
                }
            }
            req.session.myData.roost = req.session.myData.selectedRoost.id
            
        }
    }

    function startNewRoost(req){
        var _randomID = Math.floor(100000 + Math.random() * 900000)
        req.session.myData.newRoost.id = _randomID
        req.session.myData.newRoost.inprogress = false
        setSelectedRoost(req, _randomID)
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
            _thisApplication.tasklist.total = _totalSections - 1
        }

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
                var _sectionsRequired = ["1","2","4","5","6","7","8"]
                if(_thisApplication.consent == "No"){
                    _sectionsRequired = ["1","2","4","5","6","7"]
                }
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
        req.session.myData = JSON.parse(JSON.stringify(_myData))

        //Tasklist
        // 1 = purpose
        // 2 = application details
        // 3 = send
        // 4 = site
        // 5 = applicant
        // 6 = ecologist
        // 7 = permission (eligibility)
        // 8 = permissions data
        req.session.myData.tasklist = {
            "sections": {
                "1": "cannotstartyet",
                "2": "cannotstartyet",
                "3": "cannotstartyet",
                "4": "cannotstartyet",
                "5": "cannotstartyet",
                "6": "cannotstartyet",
                "7": "notstarted",
                "8": "cannotstartyet"
            },
            "completed": 0,
            "total": 0
        }

        req.session.myData.applications = [
            {
                "id": "2021-12345-EPS-MIT", 
                "type": "a13", 
                "new": false, 
                "status": "inprogress", 
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "roosts": [], 
                "consents": [], 
                "starteddate": new Date(2021, 10, 06, 16, 20, 0, 0),
                "lastsaveddate": new Date(2021, 10, 06, 17, 01, 30, 0),
                // 4 inprogress
                "siteName": "12 Parkland Avenue",
                // 7 complete
                "landOwner": "Yes", 
                "landOwnerPermission": "", 
                "consent": "Yes", 
                "consentGranted": "Yes", 
                "consentNumbers": [], 
                // 5 complete
                "applicantName": "John Smith", 
                "applicantHasCompany": "No", 
                "applicantCompany": "", 
                "applicantAddress": "2 High Street", 
                "applicantAddress1": "2 High Street", 
                "applicantAddress2": "", 
                "applicantAddress3": "Oxford", 
                "applicantAddress4": "Oxfordshire", 
                "applicantPostcode": "B1 1AA", 
                "applicantHasPostcode": "true"
            },
            {
                "id": "2021-73955-EPS-MIT", 
                "type": "a14", 
                "new": false, 
                "status": "inprogress", 
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "roosts": [], 
                "consents": [], 
                "starteddate": new Date(2021, 10, 07, 16, 20, 0, 0),
                "lastsaveddate": new Date(2021, 10, 07, 17, 01, 30, 0),
                // 7 complete
                "landOwner": "Yes", 
                "landOwnerPermission": "", 
                "consent": "No", 
                "consentGranted": "", 
                "consentNumbers": [], 
                // 5 complete
                "applicantName": "Jane Doe", 
                "applicantHasCompany": "No", 
                "applicantCompany": "", 
                "applicantAddress": "10 High Street", 
                "applicantAddress1": "10 High Street", 
                "applicantAddress2": "", 
                "applicantAddress3": "Oxford", 
                "applicantAddress4": "Oxfordshire", 
                "applicantPostcode": "D1 9AA", 
                "applicantHasPostcode": "true"
            },
            {
                "id": "2021-98765-EPS-MIT",
                "type": "a14",
                "new": false,
                "status": "submitted",
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "roosts": [],
                "consents": [],
                "starteddate": new Date(2021, 10, 03, 11, 05, 0, 0),
                "lastsaveddate": new Date(2021, 10, 10, 16, 47, 40, 0),
                "siteName": "Smiths Farmyard"
            },
            {
                "id": "2021-45678-EPS-MIT",
                "type": "a13",
                "new": false,
                "status": "submitted",
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "roosts": [],
                "consents": [],
                "starteddate": new Date(2021, 09, 12, 11, 05, 0, 0),
                "lastsaveddate": new Date(2021, 09, 17, 16, 47, 40, 0),
                "siteName": "20 High Street, Oxford"
            }
        ]
        //Preset answers
        req.session.myData.applications[0].tasklist.sections["4"] = "inprogress"
        req.session.myData.applications[0].tasklist.sections["5"] = "completed"
        req.session.myData.applications[0].tasklist.sections["7"] = "completed"
        req.session.myData.applications[1].tasklist.sections["5"] = "completed"
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

        
        
        // Default setup
        req.session.myData.service = "apply"
        req.session.myData.licenceType = "a13"
        req.session.myData.roostToRemove = "123456789"
        req.session.myData.signedIn = "false"

        //Default answers
        req.session.myData.application = "2021-12345-EPS-MIT"

        req.session.myData.newApplication = 
            {
                "id": Math.floor(100000 + Math.random() * 900000),
                "type": req.session.myData.licenceType,
                "new": true,
                "status": "notstarted",
                "starteddate": new Date(),
                "lastsaveddate": new Date(),
                "tasklist": JSON.parse(JSON.stringify(req.session.myData.tasklist)),
                "roosts": [],
                "consents": []
            }

        req.session.myData.roost = Math.floor(100000 + Math.random() * 900000)
        req.session.myData.newRoost = {"id": req.session.myData.roost,"bats":[],"new":true, "inprogress": false}

        req.session.myData.consent = Math.floor(100000 + Math.random() * 900000)
        req.session.myData.newConsent = {"id": req.session.myData.consent,"type":{},"new":true, "inprogress": false}






        //Set test roost (just for deep links to work) - in pages if testdata == true, we will use the testRoost
        req.session.myData.testdata = 'false'
        req.session.myData.testRoost = {
            "id": 123456789,
            "bats": [
                {
                    "id": req.session.myData.batSpecies2[0].id,
                    "name": req.session.myData.batSpecies2[0].name,
                    "numberUsing": "5",
                    "roostUses": [
                        JSON.parse(JSON.stringify(req.session.myData.roostUses3[0])),
                        JSON.parse(JSON.stringify(req.session.myData.roostUses3[1]))
                    ],
                    "activities": [
                        JSON.parse(JSON.stringify(req.session.myData.batActivities3[0])),
                        JSON.parse(JSON.stringify(req.session.myData.batActivities3[1]))
                    ]
                }
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
        setSelectedApplication(req,req.session.myData.application)

        // TODO - add application to saved applications (after eligiblity?)

        // if(req.session.myData.selectedApplication.new){
        //     req.session.myData.selectedApplication.tasklist = JSON.parse(JSON.stringify(req.session.myData.tasklist))
        //     req.session.myData.selectedApplication.new = false
        // }

        //Selected roost
        req.session.myData.roost = req.query.roost || req.session.myData.roost
        setSelectedRoost(req,req.session.myData.roost)

        //Selected consent
        req.session.myData.consent = req.query.consent || req.session.myData.consent
        setSelectedConsent(req,req.session.myData.consent)

        //Site map filter
        req.session.myData.findlocation = req.query.findlocation || req.session.myData.findlocation

        //Licence type
        req.session.myData.licenceType =  req.query.l || req.session.myData.licenceType

        //Signed in
        req.session.myData.signedIn =  req.query.si || req.session.myData.signedIn

        //Service name
        setServiceName(req)

        //Update tasklist data
        updateTasklist(req)

        //Set friendly dates
        setFriendlyDates(req)

        //Set service name
        setServiceName(req)

        next()
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
    router.get('/' + version + '/*', function (req, res, next) {
        
        var _fileName = res.req.params[0]

        if(_fileName.startsWith("defraid")){
            req.session.myData.signedIn = "true"
            var _redirectTo = _fileName.split('-')[1];
            res.redirect(301, '/' + version + '/' + _redirectTo);
        } else {
            next()
        }

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
            if(req.headers.origin == 'http://localhost:3000') {
                // Local
                res.redirect(301, 'https://whoareyou:menotyou@identity-management-app.herokuapp.com/tasked/gov-gateway/login?returnUrl=http://localhost:3000/' + version + '/defraid-applications');
            } else {
                // Live
                res.redirect(301, 'https://whoareyou:menotyou@identity-management-app.herokuapp.com/tasked/gov-gateway/login?returnUrl=https://defra:wildlife@sustainable-prototype.herokuapp.com/' + version + '/defraid-applications');
            }
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
                default:
                    _licenceType = "a13"
            }
           
            res.redirect(301, '/' + version + '/tasklist?new=true&l=' + _licenceType);

        }
        
    });

    // Tasklist bat
    router.get('/' + version + '/tasklist', function (req, res) {
        
        if(req.query.new){
            // Start new application
            startNewApplication(req)
            // addApplicationToSavedApplications(req,req.session.myData.selectedApplication)
            // setSelectedApplication(req,req.session.myData.selectedApplication.id.toString())
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
                req.session.myData.selectedApplication.consentNumbers = []
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
            res.redirect(301, '/' + version + '/tasklist');
        } else {
            if(req.headers.origin == 'http://localhost:3000') {
                // Local
                res.redirect(301, 'https://whoareyou:menotyou@identity-management-app.herokuapp.com/tasked/gov-gateway/login?returnUrl=http://localhost:3000/' + version + '/defraid-tasklist');
            } else {
                // Live
                res.redirect(301, 'https://whoareyou:menotyou@identity-management-app.herokuapp.com/tasked/gov-gateway/login?returnUrl=https://defra:wildlife@sustainable-prototype.herokuapp.com/' + version + '/defraid-tasklist');
            }
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
                res.redirect(301, '/' + version + '/reason');
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
                res.redirect(301, '/' + version + '/work-small');
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
                res.redirect(301, '/' + version + '/work-public');
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
                    res.redirect(301, '/' + version + '/important-populations');
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

    // Roost remove
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






    // Intro roosts
    router.get('/' + version + '/intro-roosts', function (req, res) {

        req.session.myData.selectedApplication.tasklist.sections["2"] = "inprogress"

        res.render(version + '/intro-roosts', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/intro-roosts', function (req, res) {
        updateLastSavedDate(req,req.session.myData.selectedApplication)
        res.redirect(301, '/' + version + '/species-bat');
    });


    // BAT Species
    router.get('/' + version + '/species-bat', function (req, res) {
        res.render(version + '/species-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/species-bat', function (req, res) {

        req.session.myData.speciesBatTempAnswer = req.body.bat

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.speciesBatTempAnswer = req.body.bat || "_bat-1"
        }
        if(!req.session.myData.speciesBatTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.speciesBatAnswer = {
                "anchor": "_bat-1",
                "message": "[error message]"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            res.render(version + '/species-bat', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            // var _selectedBat = req.session.myData.batSpecies2.find(obj => {return obj.id.toString() === req.session.myData.speciesBatTempAnswer});

            // req.session.myData.selectedRoost.bats.push(_selectedBat)

            req.session.myData.batSpecies2.forEach(function(_bat, index) {
                var _alreadyListed = req.session.myData.selectedRoost.bats.find(obj => {return obj.id.toString() === _bat.id.toString()})

                if(req.session.myData.speciesBatTempAnswer == _bat.id){
                    // TICKED
                    if(_alreadyListed){
                        // if already in there leave it (could have other answers on it)
                    } else {
                        // else add it
                        req.session.myData.selectedRoost.bats.push(_bat)
                    }
                }
            });

            req.session.myData.speciesBatTempAnswer = ""

            //Roost query string
            var _roostQS = ''
            if(!req.session.myData.selectedRoost.new){
                _roostQS = '?roost=' + req.session.myData.roost
            }

            res.redirect(301, '/' + version + '/using-roost' + _roostQS);
        }
    });


    // Roost bats using
    router.get('/' + version + '/using-roost', function (req, res) {
        res.render(version + '/using-roost', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/using-roost', function (req, res) {

        req.session.myData.roostUsesAnswersTemp = []

        req.session.myData.selectedRoost.bats.forEach(function(_bat, index) {

                req.session.myData.roostUsesAnswersTemp[_bat.id] = req.body[_bat.id]

                if(req.session.myData.includeValidation == "false"){
                    if(req.session.myData.roostUsesAnswersTemp[_bat.id] == "_unchecked"){
                        req.session.myData.roostUsesAnswersTemp[_bat.id] = "_roostUse-1"
                    } else {
                        req.session.myData.roostUsesAnswersTemp[_bat.id] = req.session.myData.roostUsesAnswersTemp[_bat.id] || "_roostUse-1"
                    }
                }
                if(req.session.myData.roostUsesAnswersTemp[_bat.id] == "_unchecked"){
                // for radios = if(!req.session.myData.roostUsesAnswersTemp[_bat.id]){
                    req.session.myData.validationError = "true"
                    req.session.myData.validationErrors[_bat.id] = {
                        "anchor": _bat.id + "-1",
                        "message": "[error message]"
                    }
                }
        });

        if(req.session.myData.validationError == "true") {
            res.render(version + '/using-roost', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            //Set selected roost uses
            req.session.myData.selectedRoost.bats.forEach(function(_bat, index) {
                _bat.roostUses = []
                req.session.myData.roostUses3.forEach(function(_roostUse, index) {
                    if(req.session.myData.roostUsesAnswersTemp[_bat.id].indexOf(_roostUse.id.toString()) != -1){
                        _bat.roostUses.push(_roostUse)
                    }
                });
            });
            req.session.myData.roostUsesAnswersTemp = []
            
            //Roost query string
            var _roostQS = ''
            if(!req.session.myData.selectedRoost.new){
                _roostQS = '?roost=' + req.session.myData.roost
            }

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-bat');
            } else {
                res.redirect(301, '/' + version + '/numbers-bat' + _roostQS);
            }

        }

    });


    // BAT Numbers
    router.get('/' + version + '/numbers-bat', function (req, res) {
        res.render(version + '/numbers-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/numbers-bat', function (req, res) {

        //CHECK ANSWERS
        req.session.myData.selectedRoost.bats.forEach(function(_bat, index) {

            //entered values (set to temp)
            req.session.myData["numberUsingTemp" + _bat.id] = req.body["numberUsing" + _bat.id]

            //no validation defaults
            if(req.session.myData.includeValidation == "false"){
                req.session.myData["numberUsingTemp" + _bat.id] = req.session.myData["numberUsingTemp" + _bat.id] || 1
            }

            // TODO order of errors

            //check validation
            if(!req.session.myData["numberUsingTemp" + _bat.id]){
                req.session.myData.validationError = "true"
                req.session.myData.validationErrors["numberUsing" + _bat.id] = {
                    "anchor": "numberUsing" + _bat.id,
                    "message": "[error message for " + _bat.name + "]"
                }
            }

        });

        if(req.session.myData.validationError == "true") {
            res.render(version + '/numbers-bat', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            req.session.myData.selectedRoost.bats.forEach(function(_bat, index) {
                req.session.myData["numberUsing" + _bat.id] = req.session.myData["numberUsingTemp" + _bat.id]

                _bat.numberUsing = req.session.myData["numberUsing" + _bat.id]

                req.session.myData["numberUsingTemp" + _bat.id] = ""
            });

            //Roost query string
            var _roostQS = ''
            if(!req.session.myData.selectedRoost.new){
                _roostQS = '?roost=' + req.session.myData.roost
            }

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-bat');
            } else {
                res.redirect(301, '/' + version + '/activities-bat' + _roostQS);
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

            //Roost query string
            // var _roostQS = ''
            // if(!req.session.myData.selectedRoost.new){
            //     _roostQS = '?roost=' + req.session.myData.roost
            // }

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-newt');
            } else {
                res.redirect(301, '/' + version + '/activities-newt');
            }

        }
        
    });

    // Activities on bats in roost
    router.get('/' + version + '/activities-bat', function (req, res) {
        res.render(version + '/activities-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/activities-bat', function (req, res) {

        req.session.myData.activitiesBatAnswersTemp = []

        req.session.myData.selectedRoost.bats.forEach(function(_bat, index) {

                req.session.myData.activitiesBatAnswersTemp[_bat.id] = req.body[_bat.id]

                if(req.session.myData.includeValidation == "false"){
                    if(req.session.myData.activitiesBatAnswersTemp[_bat.id] == "_unchecked"){
                        req.session.myData.activitiesBatAnswersTemp[_bat.id] = "_batActivity-1"
                    } else {
                        req.session.myData.activitiesBatAnswersTemp[_bat.id] = req.session.myData.activitiesBatAnswersTemp[_bat.id] || "_batActivity-1"
                    }
                }
                if(req.session.myData.activitiesBatAnswersTemp[_bat.id] == "_unchecked"){
                // for radios = if(!req.session.myData.activitiesBatAnswersTemp[_bat.id]){
                    req.session.myData.validationError = "true"
                    req.session.myData.validationErrors[_bat.id] = {
                        "anchor": _bat.id + "-1",
                        "message": "[error message]"
                    }
                }
        });

        if(req.session.myData.validationError == "true") {
            res.render(version + '/activities-bat', {
                myData:req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            //Set selected bat activties
            req.session.myData.selectedRoost.bats.forEach(function(_bat, index) {
                _bat.activities = []
                req.session.myData.batActivities3.forEach(function(_batActivity, index) {
                    if(req.session.myData.activitiesBatAnswersTemp[_bat.id].indexOf(_batActivity.id.toString()) != -1){
                        _bat.activities.push(_batActivity)
                    }
                });
            });
            req.session.myData.activitiesBatAnswersTemp = []

            //ADD ROOST TO APPLICATION
            addRoostToApplication(req,req.session.myData.selectedRoost)

            setSelectedRoost(req,req.session.myData.selectedRoost.id.toString())
            
            //TODO check if this needs to be set BEFORE changing new to false
            //Roost query string
            var _roostQS = ''
            if(!req.session.myData.selectedRoost.new){
                _roostQS = '?roost=' + req.session.myData.roost
            }

            res.redirect(301, '/' + version + '/cya-bat');
            // res.redirect(301, '/' + version + '/roosts-added' + _roostQS);
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
            //Roost query string
            // var _roostQS = ''
            // if(!req.session.myData.selectedRoost.new){
            //     _roostQS = '?roost=' + req.session.myData.roost
            // }

            res.redirect(301, '/' + version + '/cya-newt');

        }

    });

    // Check your answers bat
    router.get('/' + version + '/cya-bat', function (req, res) {
        res.render(version + '/cya-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-bat', function (req, res) {

        req.session.myData.addRoostAnswer = req.body.addRoost

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.addRoostAnswer = req.session.myData.addRoostAnswer || "No"
        }

        if(!req.session.myData.addRoostAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.addRoost = {
                "anchor": "addRoost-1",
                "message": "[error message for add roost]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/cya-bat', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            if(req.session.myData.addRoostAnswer == 'yes'){
                startNewRoost(req)
                res.redirect(301, '/' + version + '/intro-roosts');
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


    // Roost remove
    router.get('/' + version + '/roost-remove', function (req, res) {

        req.session.myData.roostToRemove = req.query.roostToRemove

        res.render(version + '/roost-remove', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/roost-remove', function (req, res) {

        req.session.myData.removeRoostAnswer = req.body.removeRoost

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.removeRoostAnswer = req.session.myData.removeRoostAnswer || "No"
        }

        if(!req.session.myData.removeRoostAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.removeRoost = {
                "anchor": "removeRoost-1",
                "message": "[error message for remove roost]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/roost-remove', {
                myData: req.session.myData
            });
        } else {

            updateLastSavedDate(req,req.session.myData.selectedApplication)

            if(req.session.myData.removeRoostAnswer == 'yes'){

                var _removeID = req.session.myData.roostToRemove.toString(),
                    _roost = req.session.myData.selectedApplication.roosts.find(obj => {return obj.id.toString() === _removeID})
                
                if(_roost){
                    //remove it
                    var removeIndex = req.session.myData.selectedApplication.roosts.map(item => item.id.toString()).indexOf(_removeID);
                    (removeIndex >= 0) && req.session.myData.selectedApplication.roosts.splice(removeIndex, 1);
                }

                if(req.session.myData.selectedApplication.roosts.length == 0) {
                    startNewRoost(req)
                    res.redirect(301, '/' + version + '/intro-roosts');
                } else {
                    res.redirect(301, '/' + version + '/cya-bat');
                }
                

            } else {
                res.redirect(301, '/' + version + '/cya-bat');
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
                res.redirect(301, '/' + version + '/site-postcode');
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
                    res.redirect(301, '/' + version + '/site-boundary');
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
                res.redirect(301, '/' + version + '/site-boundary' + "?findlocation=place&location=" + req.session.myData.selectedApplication.sitePostcode);
            }

        }

    });

    //TODO add error style to all text boxes (red border on text inputs)

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

    //Applicant name
    router.get('/' + version + '/applicant-name', function (req, res) {

        req.session.myData.selectedApplication.tasklist.sections["5"] = "inprogress"

        res.render(version + '/applicant-name', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/applicant-name', function (req, res) {

        req.session.myData.applicantNameAnswer = req.body.applicantName

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.applicantNameAnswer = req.session.myData.applicantNameAnswer || "John Smith"
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
            req.session.myData.applicantCompanyTempAnswer = req.session.myData.applicantCompanyTempAnswer || "COMPANY NAME LTD"
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
            
            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-applicant');
            } else {
                res.redirect(301, '/' + version + '/applicant-postcode');
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

        req.session.myData.selectedApplication.tasklist.sections["5"] = "completed"
        updateTasklist(req)
        res.redirect(301, '/' + version + '/tasklist');
        
    });

    //Ecologist name
    router.get('/' + version + '/ecologist-name', function (req, res) {

        req.session.myData.selectedApplication.tasklist.sections["6"] = "inprogress"

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
            
            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-ecologist');
            } else {
                res.redirect(301, '/' + version + '/ecologist-postcode');
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

        req.session.myData.selectedApplication.tasklist.sections["6"] = "completed"
        updateTasklist(req)
        res.redirect(301, '/' + version + '/tasklist');
        
    });

    // Applications list
    router.get('/' + version + '/applications', function (req, res) {

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

                            // TODO - better ordering between 2 granted ones than last saved date? e.g. licence issued date? licence valid from date? licence valid to date? should expired licences be bottom?

                            //Sort on last saved date
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

    // Licence
    router.get('/' + version + '/licence', function (req, res) {

        req.session.myData.signedIn = "true"

        res.render(version + '/licence', {
            myData:req.session.myData
        });
    });



}