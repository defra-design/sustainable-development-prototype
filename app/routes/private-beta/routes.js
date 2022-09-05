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


}