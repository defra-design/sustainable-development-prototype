const e = require("express");

module.exports = function (router,_myData) {

    var version = "2-0";

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

    function setSelectedRoost(req){
        var _existingRoost = req.session.myData.selectedApplication.roosts.find(obj => {return obj.id.toString() === req.query.roost})
        if(req.query.roost && _existingRoost){
            req.session.myData.selectedRoost = _existingRoost
        } else {
            if(!req.session.myData.newRoost.inprogress){
                //TODO - set to inprogress false AND new to false at end of creation of the new roost details
                req.session.myData.newRoost.inprogress = true
                req.session.myData.selectedRoost = req.session.myData.newRoost
            }
        }
        req.session.myData.roost = req.session.myData.selectedRoost.id
    }

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))

        // Default setup
        req.session.myData.service = "apply"

        //Default answers
        req.session.myData.application = 1

        var _randomID = Math.floor(100000 + Math.random() * 900000)
        req.session.myData.newRoost = {"id": _randomID,"bats":[],"new":true, "inprogress": false}

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
        setSelectedApplication(req,req.session.myData.application)
        setSelectedRoost(req)

        //Set default roost (for deep links to work)
        // req.session.myData.defaultRoost = {
        //     "id":"111111",
        //     "bats":[],
        //     "new":false,
        //     "inprogress":false
        // }
        // req.session.myData.batSpecies2.forEach(function(_bat, index) {
        //     var _batObject = {
        //         "id":_bat.id,
        //         "name":_bat.name
        //     }
        //     req.session.myData.defaultRoost.bats.push(_batObject)
        // });

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

        // set selected roost
        setSelectedRoost(req)

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

            //check validation
            if(!req.session.myData["numberUsingTemp" + _bat.id]){
                req.session.myData.validationError = "true"
                req.session.myData.validationErrors["numberUsing" + _bat.id] = {
                    "anchor": "numberUsing" + _bat.id,
                    "message": "[error message for NUMBER USING " + _bat.name + "]"
                }
            }

            if(!req.session.myData["numberInTemp" + _bat.id]){
                req.session.myData.validationError = "true"
                req.session.myData.validationErrors["numberIn" + _bat.id] = {
                    "anchor": "numberIn" + _bat.id,
                    "message": "[error message for NUMBER IN DURING WORKS " + _bat.name + "]"
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
            });

            //Roost query string
            var _roostQS = ''
            if(!req.session.myData.selectedRoost.new){
                _roostQS = '?roost=' + req.session.myData.roost
            }

            res.redirect(301, '/' + version + '/using-roost?roost=' + req.session.myData.roost);

        }
        
    });


    // Roost bats using
    router.get('/' + version + '/using-roost', function (req, res) {
        res.render(version + '/using-roost', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/using-roost', function (req, res) {

        req.session.myData.selectedRoost.bats.forEach(function(_bat, index) {

                var _answer = req.body[_bat.id]

                if(_answer == "_unchecked"){
                    req.session.myData.validationError = "true"
                    req.session.myData.validationErrors[_bat.id] = {
                        "anchor": _bat.id + "-1",
                        "message": "[error message]"
                    }
                } else {
                    _bat.roostUses = []
                    //Set selected roost uses
                    req.session.myData.roostUses.forEach(function(_roostUse, index) {
                    // _bat.roostUses.forEach(function(_roostUse, index) {
                        if(_answer.indexOf(_roostUse.id.toString()) != -1){
                            _bat.roostUses.push(_roostUse)
                            // _roostUse.selected = true
                        } else {
                            // _roostUse.selected = false
                        }
                    });
                }
                if(req.session.myData.includeValidation == "false"){
                    req.session.myData.roostUsesAnswersTemp[_bat.id] = _answer || "_roostUse-1"
                }

        });

        if(req.session.myData.validationError == "true") {
            res.render(version + '/using-roost', {
                myData:req.session.myData
            });
        } else {

            var _newQueryString = ""
            if(req.session.myData.selectedRoost.new){
                _newQueryString = "&new=true"
                //add roost to application
                req.session.myData.selectedApplication.roosts.push(req.session.myData.selectedRoost)
            }

            res.redirect(301, '/' + version + '/test-end?roost=' + req.session.myData.roost + _newQueryString);
        }

    });








    // BAT Activities
    router.get('/' + version + '/activities-bat', function (req, res) {
        res.render(version + '/activities-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/activities-bat', function (req, res) {

        req.session.myData.activitiesBatAnswerTemp = req.body.activity
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.activitiesBatAnswerTemp = req.session.myData.activitiesBatAnswerTemp || "_activity-1"
        }
        if(req.session.myData.activitiesBatAnswerTemp == "_unchecked"){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.activitiesBatAnswer = {
                "anchor": "_activity-1",
                "message": "Select the activities that will be used to affect this species of bat"
            }
        }

        if(req.session.myData.validationError == "true") {
            req.session.myData.selectedBat.activities.forEach(function(_activity, index) {
                _activity.selected = false
            });
            res.render(version + '/activities-bat', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.activitiesBatAnswer = req.session.myData.activitiesBatAnswerTemp
            req.session.myData.activitiesBatAnswerTemp = ''

            req.session.myData.selectedBat.activities.forEach(function(_activity, index) {
                if(req.session.myData.activitiesBatAnswer.indexOf(_activity.id.toString()) != -1){
                    _activity.selected = true
                } else {
                    _activity.selected = false
                }
            });
            res.redirect(301, '/' + version + '/methods-bat?bat=' + req.session.myData.selectedBat.id + "&loop=" + req.session.myData.selectedBatLoop);
        }

    });

    // BAT Methods
    router.get('/' + version + '/methods-bat', function (req, res) {
        res.render(version + '/methods-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/methods-bat', function (req, res) {

        req.session.myData.selectedBat.activities.forEach(function(_activity, index) {
            if(_activity.selected){
                var _answer = req.body[_activity.id]

                if(_answer == "_unchecked"){
                    req.session.myData.validationError = "true"
                    req.session.myData.validationErrors[_activity.id] = {
                        // "anchor": _activity.id,
                        "anchor": _activity.id + "-1",
                        "message": "Select the methods that will be used to affect this species of bat"
                    }
                } else {
                    //Set selected methods
                    _activity.methods.forEach(function(_method, index) {
                        if(_answer.indexOf(_method.id.toString()) != -1){
                            _method.selected = true
                        } else {
                            _method.selected = false
                        }
                    });
                }
                if(req.session.myData.includeValidation == "false"){
                    req.session.myData.methodAnswersTemp[_activity.id] = _answer || "_method-1"
                }
            }

        });

        if(req.session.myData.validationError == "true") {
            res.render(version + '/methods-bat', {
                myData:req.session.myData
            });
        } else {
            // Decide next page
            // if(req.session.myData.selectedBatLoop < req.session.myData.selectedBatTotal){
            //     req.session.myData.selectedBatLoop++
            //     var _loop = 1
            //     req.session.myData.batSpecies2.forEach(function(_bat, index) {
            //         if(_bat.selected){
            //             if(req.session.myData.selectedBatLoop == _loop){
            //                 req.session.myData.bat = _bat.id
            //             }
            //             _loop++
            //         }
            //     });
            //     setSelectedBat(req,req.session.myData.bat)
                res.redirect(301, '/' + version + '/numbers-bat?bat=' + req.session.myData.selectedBat.id + "&loop=" + req.session.myData.selectedBatLoop);
            // } else {
            //     res.redirect(301, '/' + version + '/test-end');
            // }
        }

    });

    // BAT date
    router.get('/' + version + '/date-bat', function (req, res) {
        res.render(version + '/date-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/date-bat', function (req, res) {

        // Decide next page
        if(req.session.myData.selectedBatLoop < req.session.myData.selectedBatTotal){
            req.session.myData.selectedBatLoop++
            var _loop = 1
            req.session.myData.batSpecies2.forEach(function(_bat, index) {
                if(_bat.selected){
                    if(req.session.myData.selectedBatLoop == _loop){
                        req.session.myData.bat = _bat.id
                    }
                    _loop++
                }
            });
            setSelectedBat(req,req.session.myData.bat)
            res.redirect(301, '/' + version + '/activities-bat?bat=' + req.session.myData.selectedBat.id + "&loop=" + req.session.myData.selectedBatLoop);
        } else {
            res.redirect(301, '/' + version + '/test-end');
        }

    });






    // test end
    router.get('/' + version + '/test-end', function (req, res) {
        res.render(version + '/test-end', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/test-end', function (req, res) {
        res.redirect(301, '/' + version + '/species-bat?r=t');
    });

}