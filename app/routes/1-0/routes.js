module.exports = function (router,_myData) {

    var version = "1-0";

    function setSelectedBat(req, _batParameter){
        if(_batParameter){
            for (var i = 0; i < req.session.myData.batSpecies.length; i++) {
                var _thisBat = req.session.myData.batSpecies[i]
                if(_thisBat.id.toString() == _batParameter.toString()){
                    req.session.myData.selectedBat = _thisBat
                    req.session.myData.bat = _thisBat.id
                }
            }
        }
    }

    function reset(req){
        req.session.myData = JSON.parse(JSON.stringify(_myData))

        // Default setup
        req.session.myData.service = "apply"

        //Default answers
        req.session.myData.bat = "_bat-1"
        req.session.myData.selectedBatTotal = 0
        req.session.myData.selectedBatLoop = 1

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
        req.session.myData.bat = req.query.bat || req.session.myData.bat
        req.session.myData.selectedBatLoop = req.query.loop || req.session.myData.selectedBatLoop

        setSelectedBat(req,req.session.myData.bat)

        next()
    });

    // Prototype setup
    router.get('/' + version + '/setup', function (req, res) {
        res.render(version + '/setup', {
            myData:req.session.myData
        });
    });

    // BAT Species
    router.get('/' + version + '/species-bat', function (req, res) {
        res.render(version + '/species-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/species-bat', function (req, res) {

        req.session.myData.speciesBatAnswerTemp = req.body.bat
        if(req.session.myData.includeValidation == "false"){
            req.session.myData.speciesBatAnswerTemp = req.session.myData.speciesBatAnswerTemp || "_bat-1"
        }
        if(req.session.myData.speciesBatAnswerTemp == "_unchecked"){
            req.session.myData.validationError = "true"
            req.session.myData.validationErrors.speciesBatAnswer = {
                "anchor": "_bat-1",
                "message": "Select the species of bat that will be affected"
            }
        }
        
        if(req.session.myData.validationError == "true") {
            req.session.myData.selectedBatTotal = 0
            req.session.myData.batSpecies.forEach(function(_bat, index) {
                _bat.selected = false
            });
            res.render(version + '/species-bat', {
                myData: req.session.myData
            });
        } else {
            req.session.myData.speciesBatAnswer = req.session.myData.speciesBatAnswerTemp
            req.session.myData.speciesBatAnswerTemp = ''

            req.session.myData.selectedBatTotal = 0
            _selectedBatSet = false
            req.session.myData.batSpecies.forEach(function(_bat, index) {
                if(req.session.myData.speciesBatAnswer.indexOf(_bat.id.toString()) != -1){
                    if(!_selectedBatSet){
                        req.session.myData.bat = _bat.id
                        _selectedBatSet = true
                    }
                    _bat.selected = true
                    req.session.myData.selectedBatTotal++
                } else {
                    _bat.selected = false
                }
            });

            req.session.myData.selectedBatLoop = 1
            setSelectedBat(req,req.session.myData.bat)

            res.redirect(301, '/' + version + '/activities-bat?bat=' + req.session.myData.selectedBat.id + "&loop=" + req.session.myData.selectedBatLoop);
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
                "message": "[error here]"
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
                        "message": "[error for " + _activity.name + "]"
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
            //     req.session.myData.batSpecies.forEach(function(_bat, index) {
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
            //     res.redirect(301, '/' + version + '/end');
            // }
        }

    });

    // BAT Numbers
    router.get('/' + version + '/numbers-bat', function (req, res) {
        res.render(version + '/numbers-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/numbers-bat', function (req, res) {

        // Decide next page
        if(req.session.myData.selectedBatLoop < req.session.myData.selectedBatTotal){
            req.session.myData.selectedBatLoop++
            var _loop = 1
            req.session.myData.batSpecies.forEach(function(_bat, index) {
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
            res.redirect(301, '/' + version + '/end');
        }

    });

}