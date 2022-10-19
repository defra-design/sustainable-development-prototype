const e = require("express");

module.exports = function (router,_myData) {

    var version = "private-beta";

router.post('/private-beta/SDDSIP-286-supplementary-file-upload/another-file', function (req, res) {
  const editChoice = req.session.data['another-file-check']

  if (editChoice === 'yes') {
    res.redirect('upload-another')
  } else if (editChoice === 'no') {
    res.redirect('task-list-complete')
  } 
});


router.post('/private-beta/SDDSIP-286-supplementary-file-upload/upload-supp-file', function (req, res) {
  const editChoice = req.session.data['upload-supp-file-check']

  if (editChoice === 'yes') {
    res.redirect('upload-file')
  } else if (editChoice === 'no') {
    res.redirect('task-list-in-progress')
  } 
});

router.post('/private-beta/SDDSIP-453-ecologist-experience/previous-license', function (req, res) {
  const editChoice = req.session.data['previous-license-check']

  if (editChoice === 'yes') {
    res.redirect('enter-license-details')
  } else if (editChoice === 'no') {
    res.redirect('enter-experience')
  } 
});

router.post('/private-beta/SDDSIP-453-ecologist-experience/another-license', function (req, res) {
  const editChoice = req.session.data['another-license-check']

  if (editChoice === 'yes') {
    res.redirect('enter-license-details-extra')
  } else if (editChoice === 'no') {
    res.redirect('enter-experience')
  } 
});

router.post('/private-beta/SDDSIP-453-ecologist-experience/another-license-extra', function (req, res) {
  const editChoice = req.session.data['another-license-extra-check']

  if (editChoice === 'yes') {
    res.redirect('enter-license-details-extra')
  } else if (editChoice === 'no') {
    res.redirect('enter-experience')
  } 
});



router.post('/private-beta/SDDSIP-453-ecologist-experience/class-mitigation-license-check', (req, res) => {
  if(req.session.data['class-mitigation-license-check'] == 'Yes'){
      res.redirect('enter-class-mitigation-details')
  } else if(req.session.data['class-mitigation-license-check'] == 'No'){
      res.redirect('check-your-answers')
  } 
});


router.post('/private-beta/SDDSIP-436-sett-details/add-another-sett-check', (req, res) => {
  if(req.session.data['add-another-sett-check'] == 'Yes'){
      res.redirect('check-your-answers-another-sett')
  } else if(req.session.data['add-another-sett-check'] == 'No'){
      res.redirect('task-list-complete')
  } 
});



router.post('/private-beta/SSDSIP-188-invoice-details/responsible-for-invoice', function (req, res) {
  const editChoice = req.session.data['responsible-for-invoice-check']

  if (editChoice === 'applicant') {
    res.redirect('contact-details')
  } else if (editChoice === 'ecologist') {
    res.redirect('contact-details-ecologist')
  } else if (editChoice === 'someone-else') {
    res.redirect('invoice-name')
  } 
  
});

router.post('/private-beta/SSDSIP-188-invoice-details/invoice-contact-details', (req, res) => {
  if(req.session.data['invoice-contact-details-check'] == 'Yes'){
      res.redirect('purchase-order')
  } else if(req.session.data['invoice-contact-details-check'] == 'No'){
      res.redirect('invoice-name')
  } 
});

router.post('/private-beta/SDDSIP-285-authorised-person/add-person', (req, res) => {
  if(req.session.data['add-person-check'] == 'yes'){
      res.redirect('name')
  } else if(req.session.data['add-person-check'] == 'no'){
      res.redirect('task-list-complete-not-added')
  } 
});

router.post('/private-beta/SDDSIP-285-authorised-person/v2/add-person', (req, res) => {
  if(req.session.data['add-person-check'] == 'yes'){
      res.redirect('name')
  } else if(req.session.data['add-person-check'] == 'no'){
      res.redirect('check-your-answers-not-added')
  } 
});

router.post('/private-beta/SDDSIP-285-authorised-person/v3/add-person', (req, res) => {
  if(req.session.data['add-person-check'] == 'yes'){
      res.redirect('name')
  } else if(req.session.data['add-person-check'] == 'no'){
      res.redirect('check-your-answers-not-added')
  } 
});

router.post('/private-beta/SDDSIP-285-authorised-person/add-person-alt', (req, res) => {
  if(req.session.data['add-person-alt-check'] == 'yes'){
      res.redirect('add-person-fields')
  } else if(req.session.data['add-person-alt-check'] == 'no'){
      res.redirect('task-list-complete')
  } 
});

router.post('/private-beta/SDDSIP-285-authorised-person/authorised-persons-removed', (req, res) => {
  if(req.session.data['add-person-check'] == 'yes'){
      res.redirect('name')
  } else if(req.session.data['add-person-check'] == 'no'){
      res.redirect('task-list-complete')
  } 
});

router.post('/private-beta/SDDSIP-285-authorised-person/another-person', (req, res) => {
  if(req.session.data['another-person-check'] == 'yes'){
      res.redirect('another-name')
  } else if(req.session.data['another-person-check'] == 'no'){
      res.redirect('task-list-complete')
  } 
});

router.post('/private-beta/SDDSIP-432-additional-contact/who-to-contact', (req, res) => {
  if(req.session.data['who-to-contact-check'] == 'you'){
      res.redirect('check-your-answers')
  } else if(req.session.data['who-to-contact-check'] == 'Someone else'){
      res.redirect('name')
  } 
});

router.post('/private-beta/SDDSIP-285-authorised-person/v2/are-you-sure', (req, res) => {
  if(req.session.data['remove-person-check'] == 'yes'){
      res.redirect('authorised-people-summary-all-removed')
  } else if(req.session.data['remove-person-check'] == 'no'){
      res.redirect('authorised-people-summary')
  } 
});

router.post('/private-beta/SDDSIP-285-authorised-person/v3/are-you-sure', (req, res) => {
  if(req.session.data['remove-person-check'] == 'yes'){
      res.redirect('add-person')
  } else if(req.session.data['remove-person-check'] == 'no'){
      res.redirect('check-your-answers')
  } 
});

router.post('/private-beta/SDDSIP-285-authorised-person/v3/are-you-sure-2', (req, res) => {
  if(req.session.data['remove-person-check'] == 'yes'){
      res.redirect('check-your-answers')
  } else if(req.session.data['remove-person-check'] == 'no'){
      res.redirect('check-your-answers-2')
  } 
});

router.post('/private-beta/SDDSIP-285-authorised-person/v3/add-another-authorised-person', (req, res) => {
  if(req.session.data['add-another-authorised-person-check'] == 'Yes'){
      res.redirect('name-2')
  } else if(req.session.data['add-another-authorised-person-check'] == 'No'){
      res.redirect('task-list-complete')
  } 
});

router.post('/private-beta/SDDSIP-285-authorised-person/v2/are-you-sure-2', (req, res) => {
  if(req.session.data['remove-person-check'] == 'yes'){
      res.redirect('authorised-people-summary')
  } else if(req.session.data['remove-person-check'] == 'no'){
      res.redirect('authorised-people-summary-2')
  } 
});

router.post('/private-beta/SDDSIP-214-site-map-upload/site-postcode-check', (req, res) => {
  if(req.session.data['site-postcode-check'] == 'yes'){
      res.redirect('select-address')
  } else if(req.session.data['site-postcode-check'] == 'no'){
      res.redirect('upload-map')
  } 
});

router.post('/private-beta/SDDSIP-214-site-map-upload/v2/site-postcode-check', (req, res) => {
  if(req.session.data['site-postcode-check'] == 'yes'){
      res.redirect('select-address')
  } else if(req.session.data['site-postcode-check'] == 'no'){
      res.redirect('upload-map')
  } 
});

router.post('/private-beta/SDDSIP-566-application-category/paying-for-your-license-check', (req, res) => {
  if(req.session.data['sites-check'] == 'Yes'){
      res.redirect('reason')
  } else if(req.session.data['sites-check'] == 'No'){
      res.redirect('category')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/permission-check', (req, res) => {
  if(req.session.data['permission-check'] == 'Yes'){
      res.redirect('advice')
  } else if(req.session.data['permission-check'] == 'No'){
      res.redirect('permission-no')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/advice', (req, res) => {
  if(req.session.data['advice-check'] == 'Yes'){
      res.redirect('outcome')
  } else if(req.session.data['advice-check'] == 'No'){
      res.redirect('advice-no')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/development-continue-check', (req, res) => {
  if(req.session.data['development-continue-check'] == 'Yes'){
      res.redirect('how-many-years')
  } else if(req.session.data['development-continue-check'] == 'No'){
      res.redirect('wider-project')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/agreement-check', (req, res) => {
  if(req.session.data['agreement-check'] == 'Yes'){
      res.redirect('reference')
  } else if(req.session.data['agreement-check'] == 'No'){
      res.redirect('check-your-answers')
  } 
});


router.post('/private-beta/SDDSIP-585-amend-permissions-flow/permissions-check', (req, res) => {
  if(req.session.data['permissions-check'] == 'Yes'){
      res.redirect('add-permission-start')
  } else if(req.session.data['permissions-check'] == 'No'){
      res.redirect('commitment')
  } 
});

router.post('/private-beta/SDDSIP-585-amend-permissions-flow/add-another-permission-check', (req, res) => {
  if(req.session.data['add-another-permission-check'] == 'Yes'){
      res.redirect('consent-type')
  } else if(req.session.data['add-another-permission-check'] == 'No'){
      res.redirect('redirect')
  } 
});




}