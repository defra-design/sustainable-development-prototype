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
        console.log(req.session.myData.speciesBatAnswerTemp)
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

            req.session.myData.selectedBats = []
            req.session.myData.batSpecies.forEach(function(_bat, index) {
                if(req.session.myData.speciesBatAnswer.indexOf(_bat.id.toString()) != -1){
                    req.session.myData.selectedBats.push(_bat)
                }
            });
            req.session.myData.bat = req.session.myData.selectedBats[0].id
            req.session.myData.selectedBatLoop = 1
            setSelectedBat(req,req.session.myData.bat)

            res.redirect(301, '/' + version + '/activities-bat?bat=' + req.session.myData.selectedBat.id);
        }
    });

    // BAT Activities
    router.get('/' + version + '/activities-bat', function (req, res) {
        res.render(version + '/activities-bat', {
            myData:req.session.myData
        });
    });
    router.post('/' + version + '/activities-bat', function (req, res) {

        //loop check doesnt work back links
        if(req.session.myData.selectedBatLoop < req.session.myData.selectedBats.length){
            req.session.myData.bat = req.session.myData.selectedBats[req.session.myData.selectedBatLoop].id
            setSelectedBat(req,req.session.myData.bat)
            req.session.myData.selectedBatLoop++
            res.redirect(301, '/' + version + '/activities-bat?bat=' + req.session.myData.selectedBat.id);
        } else {
            res.redirect(301, '/' + version + '/next-page');
        }

    });

}