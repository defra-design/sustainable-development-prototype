const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// Base session data
var _myData = {
    "includeValidation": "true"
}

require('./routes/1-0/routes.js')(router,JSON.parse(JSON.stringify(_myData)));

module.exports = router
