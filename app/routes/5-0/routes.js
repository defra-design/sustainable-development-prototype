const e = require("express");

module.exports = function (router,_myData) {

    var version = "5-0";

    //For copying objects to other objects
    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    function sortByName(req,array){
        array.sort(function(a,b){
            if (a.name.toUpperCase() < b.name.toUpperCase()){
                return -1
            } else if(a.name.toUpperCase() > b.name.toUpperCase()){
                return 1
            }
            return 0;
        });
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

    function setSelectedApplication(req, _applicationParameter){
        if(_applicationParameter){
            for (var i = 0; i < req.session.myData.applications.length; i++) {
                var _thisApplication = req.session.myData.applications[i]
                if(_thisApplication.id.toString() == _applicationParameter.toString()){
                    req.session.myData.selectedApplication = _thisApplication
                    req.session.myData.application = _thisApplication.id
                }
            }
        }
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

    function updateTasklist(req){ 

        var cansubmit = true

        // Counts
        req.session.myData.tasklist.completed = 0
        for (const [key, value] of Object.entries(req.session.myData.tasklist.sections)) {
            if(value == "completed"){
                req.session.myData.tasklist.completed++
            } else {
                if(key == "1" || key == "2" || key == "4"){
                    cansubmit = false
                }
            }
        }

        //Set submit to "notstarted" if all others completed
        if(cansubmit && req.session.myData.tasklist.sections["3"] == "cannotstartyet"){
            req.session.myData.tasklist.sections["3"] = "notstarted"
        }

    }

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))

        // req.session.myData.serviceName = "Apply for a licence to do work that will affect bats"

        // Default setup
        req.session.myData.service = "apply"
        req.session.myData.licenceType = "a13"
        req.session.myData.roostToRemove = "123456789"
        req.session.myData.firstDate = {
            "day": "01",
            "month": "12",
            "year": "2021"
        }

        //Tasklist
        // 1 = purpose
        // 2 = application details
        // 3 = send
        // 4 = site
        req.session.myData.tasklist = {
            "sections": {
                "1": "notstarted",
                "2": "notstarted",
                "3": "cannotstartyet",
                "4": "notstarted"
            },
            "completed": 0
        }
        

        //Default answers
        req.session.myData.application = 1
        req.session.myData.roost = Math.floor(100000 + Math.random() * 900000)
        req.session.myData.newRoost = {"id": req.session.myData.roost,"bats":[],"new":true, "inprogress": false}

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
                        clone(req.session.myData.roostUses3[0]),
                        clone(req.session.myData.roostUses3[1])
                    ],
                    "activities": [
                        clone(req.session.myData.batActivities3[0]),
                        clone(req.session.myData.batActivities3[1])
                    ]
                }
            ],
            "new": false,
            "inprogress": false
        }

    }

    // Every GET and POST
    router.all('/' + version + '/*', function (req, res, next) {
        if(!req.session.myData || req.query.r) {
            reset(req)
        }

        //version
        req.session.myData.version = version

        // Reset page validation to false by default. Will only be set to true, if applicable, on a POST of a page
        req.session.myData.validationErrors = {}
        req.session.myData.validationError = "false"
        req.session.myData.includeValidation =  req.query.includeValidation || req.session.myData.includeValidation

        //Reset page notifications
        req.session.myData.notifications = {}
        req.session.myData.showNotification = "false"

        //defaults for setup
        // req.session.myData.example =  req.query.eg || req.session.myData.example
        req.session.myData.licenceType =  req.query.l || req.session.myData.licenceType

        //Service name
        switch(req.session.myData.licenceType) {
            case "a14":
                req.session.myData.serviceName = "Apply for a licence to do work that will affect great crested newts"
                break;
            case "a13":
                req.session.myData.serviceName = "Apply for a licence to do work that will affect bats"
                break;
            default:
                req.session.myData.serviceName = "Apply for a licence to do work that will affect bats"
        }
        
        //Constant checks for query
        req.session.myData.testdata = req.query.testdata || req.session.myData.testdata
        setSelectedApplication(req,req.session.myData.application)

        req.session.myData.roost = req.query.roost || req.session.myData.roost
        setSelectedRoost(req,req.session.myData.roost)

        req.session.myData.findlocation = req.query.findlocation || req.session.myData.findlocation

        next()
    });

    // Prototype setup
    router.get('/' + version + '/setup', function (req, res) {
        res.render(version + '/setup', {
            myData:req.session.myData
        });
    });




    // Tasklist bat
    router.get('/' + version + '/tasklist', function (req, res) {
        res.render(version + '/tasklist', {
            myData:req.session.myData
        });
    });

    // Proposal bat
    router.get('/' + version + '/proposal-bat', function (req, res) {

        req.session.myData.tasklist.sections["1"] = "inprogress"

        res.render(version + '/proposal-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/proposal-bat', function (req, res) {

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
            res.render(version + '/proposal-bat', {
                myData: req.session.myData
            });
        } else {

            req.session.myData.selectedApplication.proposalBat = req.session.myData.proposalBatAnswer

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-purpose');
            } else {
                res.redirect(301, '/' + version + '/category-bat');
            }

        }
        
    });

    // Category bat
    router.get('/' + version + '/category-bat', function (req, res) {
        res.render(version + '/category-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/category-bat', function (req, res) {

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
            res.render(version + '/category-bat', {
                myData: req.session.myData
            });
        } else {

            var _category = req.session.myData.workCategories.find(obj => {return obj.id.toString() === req.session.myData.categoryBatAnswer.toString()});

            req.session.myData.selectedApplication.categoryBat = clone(_category)

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-purpose');
            } else {
                res.redirect(301, '/' + version + '/reason-bat');
            }

        }
        
    });

    // Reason bat
    router.get('/' + version + '/reason-bat', function (req, res) {
        res.render(version + '/reason-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/reason-bat', function (req, res) {

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
            res.render(version + '/reason-bat', {
                myData: req.session.myData
            });
        } else {

            var _reason = req.session.myData.batApplicationReasons.find(obj => {return obj.id.toString() === req.session.myData.reasonBatAnswer.toString()});

            req.session.myData.selectedApplication.reasonBat = clone(_reason)

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-purpose');
            } else {
                res.redirect(301, '/' + version + '/multiplot-bat');
            }

        }
        
    });

    // Multiplot?
    router.get('/' + version + '/multiplot-bat', function (req, res) {
        res.render(version + '/multiplot-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/multiplot-bat', function (req, res) {

        req.session.myData.multiplotBatAnswer = req.body.multiplotBat

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.multiplotBatAnswer = req.session.myData.multiplotBatAnswer || "no"
        }

        if(!req.session.myData.multiplotBatAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.multiplotBat = {
                "anchor": "multiplotBat-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/multiplot-bat', {
                myData: req.session.myData
            });
        } else {

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
            req.session.myData.workHomeAnswer = req.session.myData.workHomeAnswer || "no"
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
            req.session.myData.workSmallAnswer = req.session.myData.workSmallAnswer || "no"
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
            req.session.myData.workProtectedAnswer = req.session.myData.workProtectedAnswer || "no"
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
            req.session.myData.workPublicAnswer = req.session.myData.workPublicAnswer || "no"
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
            req.session.myData.workExtendAnswer = req.session.myData.workExtendAnswer || "no"
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
            req.session.myData.workPrivateAnswer = req.session.myData.workPrivateAnswer || "no"
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
            req.session.myData.importantPopulationsAnswer = req.session.myData.importantPopulationsAnswer || "no"
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

            req.session.myData.selectedApplication.importantpopulations = req.session.myData.importantPopulationsAnswer
           
            res.redirect(301, '/' + version + '/cya-purpose');

        }
        
    });

    // Check your answers bat - purpose
    router.get('/' + version + '/cya-purpose', function (req, res) {
        res.render(version + '/cya-purpose', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-purpose', function (req, res) {

        req.session.myData.tasklist.sections["1"] = "completed"
        updateTasklist(req)
        res.redirect(301, '/' + version + '/tasklist');
        
    });














    // Intro roosts
    router.get('/' + version + '/intro-roosts', function (req, res) {

        req.session.myData.tasklist.sections["2"] = "inprogress"

        res.render(version + '/intro-roosts', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/intro-roosts', function (req, res) {
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
            // sortByName(req,req.session.myData.selectedRoost.bats)

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
                    req.session.myData.roostUsesAnswersTemp[_bat.id] = req.session.myData.roostUsesAnswersTemp[_bat.id] || "_roostUse-1"
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

        req.session.myData.selectedRoost.bats.forEach(function(_bat, index) {

                var _answer = req.body[_bat.id]

                if(_answer == "_unchecked"){
                    req.session.myData.validationError = "true"
                    req.session.myData.validationErrors[_bat.id] = {
                        "anchor": _bat.id + "-1",
                        "message": "[error message]"
                    }
                } else {
                    _bat.activities = []
                    //Set selected bat activities
                    req.session.myData.batActivities3.forEach(function(_batActivity, index) {
                        if(_answer.indexOf(_batActivity.id.toString()) != -1){
                            _bat.activities.push(_batActivity)
                            // _roostUse.selected = true
                        } else {
                            // _roostUse.selected = false
                        }
                    });
                }
                if(req.session.myData.includeValidation == "false"){
                    req.session.myData.batActivitiesAnswersTemp[_bat.id] = _answer || "_batActivity-1"
                }

        });

        if(req.session.myData.validationError == "true") {
            res.render(version + '/activities-bat', {
                myData:req.session.myData
            });
        } else {

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
            req.session.myData.newtActivitiesTemp = req.session.myData.newtActivitiesTemp || "_newtActivity-1"
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
            req.session.myData.addRoostAnswer = req.session.myData.addRoostAnswer || "no"
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


            if(req.session.myData.addRoostAnswer == 'yes'){
                startNewRoost(req)
                res.redirect(301, '/' + version + '/intro-roosts');
            } else {
                req.session.myData.tasklist.sections["2"] = "completed"
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
        req.session.myData.tasklist.sections["2"] = "completed"
        updateTasklist(req)
        res.redirect(301, '/' + version + '/tasklist');
    });


    // Roost remove
    router.get('/' + version + '/roost-remove', function (req, res) {

        req.session.myData.roostToRemove = req.query.roostToRemove

        req.session.myData.selectedRoostToRemove = req.session.myData.selectedApplication.roosts.find(obj => {return obj.id.toString() === req.session.myData.roostToRemove})

        res.render(version + '/roost-remove', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/roost-remove', function (req, res) {

        req.session.myData.removeRoostAnswer = req.body.removeRoost

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.removeRoostAnswer = req.session.myData.removeRoostAnswer || "no"
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

    // Complete bat
    router.get('/' + version + '/complete-bat', function (req, res) {
        res.render(version + '/complete-bat', {
            myData:req.session.myData
        });
    });

    //Site name
    router.get('/' + version + '/site-name', function (req, res) {

        req.session.myData.tasklist.sections["4"] = "inprogress"

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
            req.session.myData.siteAddressTempAnswer = req.session.myData.siteAddressTempAnswer || "address1"
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

        if((req.session.myData.findlocation == "place" && !req.query.location) || (req.session.myData.findlocation == "gridref" && !req.query.gridref)){
            req.session.myData.findlocation = ""
        }

        res.render(version + '/site-boundary', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/site-boundary', function (req, res) {
        res.redirect(301, '/' + version + '/cya-site');
    });  

    //CYA Site boundary
    router.get('/' + version + '/cya-site', function (req, res) {
        res.render(version + '/cya-site', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-site', function (req, res) {

        req.session.myData.tasklist.sections["4"] = "completed"
        updateTasklist(req)

        res.redirect(301, '/' + version + '/tasklist');
    });  



}