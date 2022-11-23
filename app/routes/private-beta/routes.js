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
      res.redirect('site-address-no-postcode')
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
      res.redirect('check-your-answers')
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
      res.redirect('lpa')
  } else if(req.session.data['permissions-check'] == 'No'){
      res.redirect('commitment-subject')
  } 
});

router.post('/private-beta/SDDSIP-585-amend-permissions-flow/add-another-permission-check', (req, res) => {
  if(req.session.data['add-another-permission-check'] == 'Yes'){
      res.redirect('consent-type-another')
  } else if(req.session.data['add-another-permission-check'] == 'No'){
      res.redirect('redirect')
  } 
});

router.post('/private-beta/SDDSIP-585-amend-permissions-flow/conditions-reserved-matters-check', (req, res) => {
  if(req.session.data['conditions-reserved-matters-check'] == 'Yes'){
      res.redirect('commitment-subject')
  } else if(req.session.data['conditions-reserved-matters-check'] == 'No'){
      res.redirect('which-not-completed')
  } 
});

router.post('/private-beta/SDDSIP-585-amend-permissions-flow/commitment-check', (req, res) => {
  if(req.session.data['commitment-check'] == 'Yes'){
      res.redirect('commitment-met')
  } else if(req.session.data['commitment-check'] == 'No'){
      res.redirect('commitment-subject-eps')
  } 
});

router.post('/private-beta/SDDSIP-585-amend-permissions-flow/commitment-eps-check', (req, res) => {
  if(req.session.data['commitment-eps-check'] == 'Yes'){
      res.redirect('commitment-eps-met')
  } else if(req.session.data['commitment-eps-check'] == 'No'){
      res.redirect('check-your-answers')
  } 
});

router.post('/private-beta/SDDSIP-585-amend-permissions-flow/consent-remove-another-check', (req, res) => {
  if(req.session.data['consent-remove-another-check'] == 'Yes'){
      res.redirect('cya-consents')
  } else if(req.session.data['consent-remove-another-check'] == 'No'){
      res.redirect('cya-consents-another')
  } 
});


router.post('/private-beta/SDDSIP-585-amend-permissions-flow/consent-remove-check', (req, res) => {
  if(req.session.data['consent-remove-check'] == 'Yes'){
      res.redirect('add-permission-start')
  } else if(req.session.data['consent-remove-check'] == 'No'){
      res.redirect('cya-consents')
  } 
});


router.post('/private-beta/SDSSIP-705-amend-additional-contacts/add-contact', (req, res) => {
  if(req.session.data['add-contact-check'] == 'Yes'){
      res.redirect('previous-contacts')
  } else if(req.session.data['add-contact-check'] == 'No'){
      res.redirect('add-ecologist-contact')
  } 
});

router.post('/private-beta/SDSSIP-705-amend-additional-contacts/previous-contacts-check', (req, res) => {
  if(req.session.data['previous-contacts-check'] == 'I want to add someone else'){
      res.redirect('name')
  } else if(req.session.data['previous-contacts-check'] == 'Sally Hughes'){
      res.redirect('add-ecologist-contact')
  } else if(req.session.data['previous-contacts-check'] == 'Dave Smith'){
      res.redirect('add-ecologist-contact')
  }  
});



router.post('/private-beta/SDSSIP-705-amend-additional-contacts/add-ecologist-contact-check', (req, res) => {
  if(req.session.data['add-ecologist-contact-check'] == 'Yes'){
      res.redirect('previous-ecologist-contacts')
  } else if(req.session.data['add-ecologist-contact-check'] == 'No'){
      res.redirect('check-your-answers')
  } 
});

router.post('/private-beta/SDSSIP-705-amend-additional-contacts/previous-ecologist-contacts-check', (req, res) => {
  if(req.session.data['previous-ecologist-contacts-check'] == 'I want to add someone else'){
      res.redirect('ecologist-name')
  } else if(req.session.data['previous-ecologist-contacts-check'] == 'Richard Henderson'){
      res.redirect('check-your-answers')
  } else if(req.session.data['previous-ecologist-contacts-check'] == 'Amy Jones'){
      res.redirect('check-your-answers')
  }  
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/on-or-within', (req, res) => {
  if(req.session.data['on-or-within-designated-site'] == 'Yes'){
      res.redirect('more-than-one-site')
  } else if(req.session.data['on-or-within-designated-site'] == 'No'){
      res.redirect('check-your-answers-none')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/more-than-one-site-check', (req, res) => {
  if(req.session.data['more-than-one-site-check'] == 'Yes'){
      res.redirect('multiple-sites-start')
  } else if(req.session.data['more-than-one-site-check'] == 'No'){
      res.redirect('designated-site-name')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/mutiple-sites-permission-check', (req, res) => {
  if(req.session.data['mutiple-sites-permission-check'] == 'Yes'){
      res.redirect('multiple-sites-advice')
  } else if(req.session.data['mutiple-sites-permission-check'] == 'No'){
      res.redirect('multiple-sites-permission-no')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/multiple-sites-advice-check', (req, res) => {
  if(req.session.data['multiple-sites-advice-check'] == 'Yes'){
      res.redirect('multiple-sites-outcome')
  } else if(req.session.data['multiple-sites-advice-check'] == 'No'){
      res.redirect('multiple-sites-advice-no')
  } 
});


}