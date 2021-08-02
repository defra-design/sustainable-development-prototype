const e = require("express");

module.exports = function (router,_myData) {

    var version = "2-0";

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

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))

        // Default setup
        req.session.myData.service = "apply"
        req.session.myData.roostToRemove = "123456789"
        req.session.myData.firstDate = {
            "day": "01",
            "month": "12",
            "year": "2021"
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
                    "numberIn": "3",
                    "roostUses": [
                        clone(req.session.myData.roostUses[0]),
                        clone(req.session.myData.roostUses[1])
                    ],
                    "activities": [
                        clone(req.session.myData.batActivities[0]),
                        clone(req.session.myData.batActivities[1])
                    ]
                }
            ],
            "new": false,
            "inprogress": false,
            "activity": clone(req.session.myData.roostActivities[0])
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

        //Constant checks for query
        req.session.myData.testdata = req.query.testdata || req.session.myData.testdata
        setSelectedApplication(req,req.session.myData.application)

        req.session.myData.roost = req.query.roost || req.session.myData.roost
        setSelectedRoost(req,req.session.myData.roost)

        next()
    });

    // Prototype setup
    router.get('/' + version + '/setup', function (req, res) {
        res.render(version + '/setup', {
            myData:req.session.myData
        });
    });


    // Intro roosts
    router.get('/' + version + '/intro-roosts', function (req, res) {
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

        req.session.myData.speciesBatAnswer = req.body.bat
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.speciesBatAnswer = "_bat-1"
        }
        if(req.session.myData.speciesBatAnswer == "_unchecked"){
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

            req.session.myData.batSpecies2.forEach(function(_bat, index) {
                var _alreadyListed = req.session.myData.selectedRoost.bats.find(obj => {return obj.id.toString() === _bat.id.toString()})

                if(req.session.myData.speciesBatAnswer.indexOf(_bat.id.toString()) != -1){
                    // TICKED
                    if(_alreadyListed){
                        // if already in there leave it (could have other answers on it)
                    } else {
                        // else add it
                        req.session.myData.selectedRoost.bats.push(_bat)
                    }
                } else {
                    // NOT TICKED
                    if(_alreadyListed){
                        // if already in there remove it
                        var removeIndex = req.session.myData.selectedRoost.bats.map(item => item.id.toString()).indexOf(_bat.id.toString());
                        (removeIndex >= 0) && req.session.myData.selectedRoost.bats.splice(removeIndex, 1);
                    }
                }
            });
            sortByName(req,req.session.myData.selectedRoost.bats)

            //Roost query string
            var _roostQS = ''
            if(!req.session.myData.selectedRoost.new){
                _roostQS = '?roost=' + req.session.myData.roost
            }

            res.redirect(301, '/' + version + '/numbers-bat' + _roostQS);
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
            req.session.myData["numberInTemp" + _bat.id] = req.body["numberIn" + _bat.id]

            //no validation defaults
            if(req.session.myData.includeValidation == "false"){
                req.session.myData["numberUsingTemp" + _bat.id] = req.session.myData["numberUsingTemp" + _bat.id] || 1
                req.session.myData["numberInTemp" + _bat.id] = req.session.myData["numberInTemp" + _bat.id] || 1
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

            if(!req.session.myData["numberInTemp" + _bat.id]){
                req.session.myData.validationError = "true"
                req.session.myData.validationErrors["numberIn" + _bat.id] = {
                    "anchor": "numberIn" + _bat.id,
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
                req.session.myData["numberIn" + _bat.id] = req.session.myData["numberInTemp" + _bat.id]

                _bat.numberUsing = req.session.myData["numberUsing" + _bat.id]
                _bat.numberIn = req.session.myData["numberIn" + _bat.id]

                req.session.myData["numberUsingTemp" + _bat.id] = ""
                req.session.myData["numberInTemp" + _bat.id] = ""
            });

            //Roost query string
            var _roostQS = ''
            if(!req.session.myData.selectedRoost.new){
                _roostQS = '?roost=' + req.session.myData.roost
            }

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-bat');
            } else {
                res.redirect(301, '/' + version + '/using-roost' + _roostQS);
            }

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
                req.session.myData.roostUses.forEach(function(_roostUse, index) {
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
                res.redirect(301, '/' + version + '/activities-roost' + _roostQS);
            }

        }

    });

    // Activities on roost
    router.get('/' + version + '/activities-roost', function (req, res) {
        res.render(version + '/activities-roost', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/activities-roost', function (req, res) {

        req.session.myData.roostActivityTempAnswer = req.body.roostActivity
        req.session.myData.roostActivityMethodsTempAnswer = ""

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.roostActivityTempAnswer = req.session.myData.roostActivityTempAnswer || "Neither"
            req.session.myData.roostActivityMethodsTempAnswer = req.session.myData.roostActivityMethodsTempAnswer || ""
        }

        if(!req.session.myData.roostActivityTempAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.roostActivity = {
                "anchor": "_roostActivity-1",
                "message": "[error message]"
            }
        } else {
            // Check methods

            //Selected Roost Activity
            req.session.myData.roostActivities.forEach(function(_roostActivity, index) {

                if(req.session.myData.roostActivityTempAnswer == _roostActivity.id){

                    if(_roostActivity.methods){

                        //validate for methods

                        var _methodsName = _roostActivity.id + "-method"
                        req.session.myData.roostActivityMethodsTempAnswer = req.body[_methodsName]

                        if(req.session.myData.roostActivityMethodsTempAnswer == "_unchecked"){
                            req.session.myData.validationError = "true"
                            req.session.myData.validationErrors[_roostActivity.id] = {
                                "anchor": _roostActivity.id + "-1",
                                "message": "[error message for " + _roostActivity.name +"]"
                            }
                        }

                    }
                }

            });

        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/activities-roost', {
                myData:req.session.myData
            });
        } else {

            var _selectedRoostActivity = req.session.myData.roostActivities.find(obj => {return obj.id.toString() === req.session.myData.roostActivityTempAnswer});

            //Set selected roost activity
            req.session.myData.selectedRoost.activity = clone(_selectedRoostActivity)

            //Set selected roost activity methods (if any)
            var _methods = req.session.myData.selectedRoost.activity.methods,
                _methodsSelected = []
            if(_methods){
                _methods.forEach(function(_method, index) {
                    if(req.session.myData.roostActivityMethodsTempAnswer.indexOf(_method.id.toString()) != -1){
                        _methodsSelected.push(_method)
                    }
                });
                req.session.myData.selectedRoost.activity.methods = _methodsSelected
            }

            req.session.myData.roostActivityTempAnswer = ""
            req.session.myData.roostActivityMethodsTempAnswer = ""
            
            //Roost query string
            var _roostQS = ''
            if(!req.session.myData.selectedRoost.new){
                _roostQS = '?roost=' + req.session.myData.roost
            }

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-bat');
            } else {
                // TODO go to bat activities if count of at least one bat species is 0
                res.redirect(301, '/' + version + '/activities-bat' + _roostQS);
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
                    req.session.myData.batActivities.forEach(function(_batActivity, index) {
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

            if(req.query.cya == "true"){
                res.redirect(301, '/' + version + '/cya-bat');
            } else {
                res.redirect(301, '/' + version + '/roosts-added' + _roostQS);
            }
        }

    });

    // Roosts summary
    router.get('/' + version + '/roosts-added', function (req, res) {
        res.render(version + '/roosts-added', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/roosts-added', function (req, res) {

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
            res.render(version + '/roosts-added', {
                myData: req.session.myData
            });
        } else {

            if(req.session.myData.addRoostAnswer == 'yes'){

                startNewRoost(req)

                res.redirect(301, '/' + version + '/species-bat');

            } else {
                res.redirect(301, '/' + version + '/date-bat');
            }

        }
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

                res.redirect(301, '/' + version + '/roosts-added');

            } else {
                res.redirect(301, '/' + version + '/roosts-added');
            }

        }
    });

    // BAT date
    router.get('/' + version + '/date-bat', function (req, res) {
        res.render(version + '/date-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/date-bat', function (req, res) {

        req.session.myData.selectedApplication.firstDate = {
            "day": req.body.day,
            "month": req.body.month,
            "year": req.body.year
        }

        if(req.query.cya == "true"){
            res.redirect(301, '/' + version + '/cya-bat');
        } else {
            res.redirect(301, '/' + version + '/surveys-bat');
        }

    });

    // Surveys conducted
    router.get('/' + version + '/surveys-bat', function (req, res) {
        res.render(version + '/surveys-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/surveys-bat', function (req, res) {

        req.session.myData.surveysBatAnswer = req.body.surveysBat

        if(req.session.myData.includeValidation == "false"){
            req.session.myData.surveysBatAnswer = req.session.myData.surveysBatAnswer || "no"
        }

        if(!req.session.myData.surveysBatAnswer){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.surveysBat = {
                "anchor": "surveysBat-1",
                "message": "[error message]"
            }
        }

        if(req.session.myData.validationError == "true") {
            res.render(version + '/surveys-bat', {
                myData: req.session.myData
            });
        } else {

            if(req.session.myData.surveysBatAnswer == 'yes'){
                req.session.myData.selectedApplication.surveys = "Yes"
                req.session.myData.selectedApplication.surveysReason = ""
                res.redirect(301, '/' + version + '/cya-bat');
            } else {
                req.session.myData.selectedApplication.surveys = "No"
                req.session.myData.selectedApplication.surveysReason = req.body["more-detail"]
                res.redirect(301, '/' + version + '/cya-bat');
            }

        }
        
    });

    // Check your answers bat
    router.get('/' + version + '/cya-bat', function (req, res) {

        //Set test data
        if(req.session.myData.testdata == "true"){
            //Date
            req.session.myData.selectedApplication.firstDate = req.session.myData.selectedApplication.firstDate || req.session.myData.firstDate
            //Surveys
            req.session.myData.selectedApplication.surveys = req.session.myData.selectedApplication.surveys || "No"
            req.session.myData.selectedApplication.surveysReason = req.session.myData.selectedApplication.surveysReason || "My reason here"
        }

        res.render(version + '/cya-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/cya-bat', function (req, res) {

        // Add another roost
        if(req.body.addRoost == "yes"){

            startNewRoost(req)

            res.redirect(301, '/' + version + '/species-bat');
        // Add application
        } else if(req.body.addApplication == "yes"){
            res.redirect(301, '/' + version + '/complete-bat');
        }
         
    });

    // Complete bat
    router.get('/' + version + '/complete-bat', function (req, res) {
        res.render(version + '/complete-bat', {
            myData:req.session.myData
        });
    });
     

}