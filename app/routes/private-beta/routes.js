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
  } else if(req.session.data['more-than-one-site-check'] == 'No, it will only take place on or within 50m of one designated site'){
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


router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/add-another-site-check', (req, res) => {
  if(req.session.data['add-another-site-check'] == 'Yes'){
      res.redirect('multiple-sites-another-designated-site-name')
  } else if(req.session.data['add-another-site-check'] == 'No'){
      res.redirect('development-continue')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/add-another-site-check', (req, res) => {
  if(req.session.data['add-another-site-check'] == 'Yes'){
      res.redirect('multiple-sites-another-designated-site-name')
  } else if(req.session.data['add-another-site-check'] == 'No'){
      res.redirect('development-continue')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/mutiple-sites-another-permission-check', (req, res) => {
  if(req.session.data['mutiple-sites-another-permission-check'] == 'Yes'){
      res.redirect('multiple-sites-another-advice')
  } else if(req.session.data['mutiple-sites-another-permission-check'] == 'No'){
      res.redirect('multiple-sites-another-advice')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/multiple-sites-another-advice-check', (req, res) => {
  if(req.session.data['multiple-sites-another-advice-check'] == 'Yes'){
      res.redirect('multiple-sites-another-outcome')
  } else if(req.session.data['multiple-sites-another-advice-check'] == 'No'){
      res.redirect('multiple-sites-another-advice-no')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/permission-check', (req, res) => {
  if(req.session.data['permission-check'] == 'Yes'){
      res.redirect('advice')
  } else if(req.session.data['permission-check'] == 'No'){
      res.redirect('advice')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/advice', (req, res) => {
  if(req.session.data['advice-check'] == 'Yes'){
      res.redirect('outcome')
  } else if(req.session.data['advice-check'] == 'No'){
      res.redirect('advice-no')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/development-continue-check', (req, res) => {
  if(req.session.data['development-continue-check'] == 'Yes'){
      res.redirect('how-many-years')
  } else if(req.session.data['development-continue-check'] == 'No'){
      res.redirect('wider-project')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/agreement-check', (req, res) => {
  if(req.session.data['agreement-check'] == 'Yes'){
      res.redirect('reference')
  } else if(req.session.data['agreement-check'] == 'No'){
      res.redirect('check-your-answers')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/remove-site-check', (req, res) => {
  if(req.session.data['remove-site-check'] == 'Yes'){
      res.redirect('multiple-sites-start')
  } else if(req.session.data['remove-site-check'] == 'No'){
      res.redirect('multiple-sites-review-add-another')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/v2/remove-site-another-check', (req, res) => {
  if(req.session.data['remove-site-another-check'] == 'Yes'){
      res.redirect('multiple-sites-review-add-another')
  } else if(req.session.data['remove-site-another-check'] == 'No'){
      res.redirect('multiple-sites-another-review-add-another')
  } 
});

router.post('/private-beta/SDSSIP-556-application-window/which-species-check', (req, res) => {
  if(req.session.data['which-species-check'] == 'Badgers'){
      res.redirect('nsip')
  }  
});

router.post('/private-beta/SDSSIP-556-application-window/nsip-check', (req, res) => {
  if(req.session.data['nsip-check'] == 'Yes'){
      res.redirect('land-owner')
  } else if(req.session.data['nsip-check'] == 'No'){
      res.redirect('window-not-open')
  } 
});

router.post('/private-beta/SDSSIP-556-application-window/land-owner-check', (req, res) => {
  if(req.session.data['land-owner-check'] == 'Yes'){
      res.redirect('consent')
  } else if(req.session.data['land-owner-check'] == 'No'){
      res.redirect('land-owner-permission')
  } 
});

router.post('/private-beta/SDSSIP-556-application-window/land-owner-permission-check', (req, res) => {
  if(req.session.data['land-owner-permission-check'] == 'Yes'){
      res.redirect('consent')
  } else if(req.session.data['land-owner-permission-check'] == 'No'){
      res.redirect('dropout-land-owner')
  } 
});

router.post('/private-beta/SDSSIP-556-application-window/consent-check', (req, res) => {
  if(req.session.data['consent-check'] == 'Yes'){
      res.redirect('consent-granted')
  } else if(req.session.data['consent-check'] == 'No'){
      res.redirect('eligible')
  } 
});

router.post('/private-beta/SDSSIP-556-application-window/consent-granted-check', (req, res) => {
  if(req.session.data['consent-granted-check'] == 'Yes'){
      res.redirect('eligible')
  } else if(req.session.data['consent-granted-check'] == 'No'){
      res.redirect('dropout-consent-granted')
  } 
});

router.post('/private-beta/SDDSIP-525-conviction-questions/any-convictions-check', (req, res) => {
  if(req.session.data['any-convictions-check'] == 'Yes'){
      res.redirect('conviction-details')
  } else if(req.session.data['any-convictions-check'] == 'No'){
      res.redirect('check-your-answers')
  } 
});

router.post('/private-beta/SDDSIP-585-amend-permissions-flow/v2/permissions-check', (req, res) => {
  if(req.session.data['permissions-check'] == 'Yes'){
      res.redirect('add-permission-start')
  } else if(req.session.data['permissions-check'] == 'No'){
      res.redirect('why-no-permission')
  } 
});

router.post('/private-beta/SDDSIP-585-amend-permissions-flow/v2/add-another-permission-check', (req, res) => {
  if(req.session.data['add-another-permission-check'] == 'Yes'){
      res.redirect('consent-type-another')
  } else if(req.session.data['add-another-permission-check'] == 'No'){
      res.redirect('redirect')
  } 
});


router.post('/private-beta/SDDSIP-585-amend-permissions-flow/v2/conditions-reserved-matters-check', (req, res) => {
  if(req.session.data['conditions-reserved-matters-check'] == 'Yes'){
      res.redirect('commitment-subject-eps')
  } else if(req.session.data['conditions-reserved-matters-check'] == 'No'){
      res.redirect('which-not-completed')
  } 
});


router.post('/private-beta/SDDSIP-585-amend-permissions-flow/v2/commitment-check', (req, res) => {
  if(req.session.data['commitment-check'] == 'Yes'){
      res.redirect('commitment-met')
  } else if(req.session.data['commitment-check'] == 'No'){
      res.redirect('commitment-subject-eps')
  } 
});


router.post('/private-beta/SDDSIP-585-amend-permissions-flow/v2/commitment-eps-check', (req, res) => {
  if(req.session.data['commitment-eps-check'] == 'Yes'){
      res.redirect('commitment-eps-met')
  } else if(req.session.data['commitment-eps-check'] == 'No'){
      res.redirect('check-your-answers')
  } 
});


router.post('/private-beta/SDDSIP-585-amend-permissions-flow/v2/consent-remove-another-check', (req, res) => {
  if(req.session.data['consent-remove-another-check'] == 'Yes'){
      res.redirect('cya-consents')
  } else if(req.session.data['consent-remove-another-check'] == 'No'){
      res.redirect('cya-consents-another')
  } 
});


router.post('/private-beta/SDDSIP-585-amend-permissions-flow/v2/consent-remove-check', (req, res) => {
  if(req.session.data['consent-remove-check'] == 'Yes'){
      res.redirect('add-permission-start')
  } else if(req.session.data['consent-remove-check'] == 'No'){
      res.redirect('cya-consents')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v3/on-or-within', (req, res) => {
  if(req.session.data['on-or-within-designated-site'] == 'Yes'){
      res.redirect('site-name')
  } else if(req.session.data['on-or-within-designated-site'] == 'No'){
      res.redirect('check-your-answers-none')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/v3/permission-check', (req, res) => {
  if(req.session.data['permission-check'] == 'Yes'){
      res.redirect('details-of-consent')
  } else if(req.session.data['permission-check'] == 'No'){
      res.redirect('advice')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v3/advice-check', (req, res) => {
  if(req.session.data['advice-check'] == 'Yes'){
      res.redirect('outcome')
  } else if(req.session.data['advice-check'] == 'No'){
      res.redirect('necessary-for-managing')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v3/significant-effect-check', (req, res) => {
  if(req.session.data['significant-effect-check'] == 'Yes'){
      res.redirect('sites-loop-start')
  } else if(req.session.data['significant-effect-check'] == 'No'){
      res.redirect('check-your-answers')
  } else if(req.session.data['significant-effect-check'] == 'I have not had advice'){
      res.redirect('check-your-answers')
  }  
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v3/necessary-check', (req, res) => {
  if(req.session.data['necessary-check'] == 'Yes'){
      res.redirect('necessary-site-name')
  } else if(req.session.data['necessary-check'] == 'No'){
      res.redirect('significant-effect')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v3/add-another-site-check', (req, res) => {
  if(req.session.data['add-another-site-check'] == 'Yes'){
      res.redirect('multiple-sites-another-designated-site-name')
  } else if(req.session.data['add-another-site-check'] == 'No'){
      res.redirect('check-your-answers')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v3/remove-site-check', (req, res) => {
  if(req.session.data['remove-site-check'] == 'Yes'){
      res.redirect('sites-loop-start')
  } else if(req.session.data['remove-site-check'] == 'No'){
      res.redirect('multiple-sites-review-add-another')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v3/remove-site-another-check', (req, res) => {
  if(req.session.data['remove-site-another-check'] == 'Yes'){
      res.redirect('multiple-sites-review-add-another')
  } else if(req.session.data['remove-site-another-check'] == 'No'){
      res.redirect('multiple-sites-another-review-add-another')
  } 
});


router.post('/private-beta/SDDSIP-827-returns/manage-licence-check', (req, res) => {
  if(req.session.data['manage-licence-check'] == 'Submit a return'){
      res.redirect('carried-out-work')
  } else if(req.session.data['manage-licence-check'] == 'View licence'){
      res.redirect('carried-out-work')
  } else if(req.session.data['manage-licence-check'] == 'Renew licence'){
      res.redirect('carried-out-work')
  } else if(req.session.data['manage-licence-check'] == 'Cancel licence'){
      res.redirect('carried-out-work')
  }  
});


router.post('/private-beta/SDDSIP-827-returns/carried-out-work-check', (req, res) => {
  if(req.session.data['carried-out-work-check'] == 'Yes'){
      res.redirect('describe-work')
  } else if(req.session.data['carried-out-work-check'] == 'No'){
      res.redirect('reported')
  }  
});

router.post('/private-beta/SDDSIP-827-returns/upload-check', (req, res) => {
  if(req.session.data['upload-check'] == 'Yes'){
      res.redirect('upload-file')
  } else if(req.session.data['upload-check'] == 'No'){
      res.redirect('check-your-answers')
  }  
});


router.post('/private-beta/SDDSIP-827-returns/another-file', function (req, res) {
  const editChoice = req.session.data['another-file-check']

  if (editChoice === 'yes') {
    res.redirect('upload-another')
  } else if (editChoice === 'no') {
    res.redirect('check-your-answers')
  } 
});


router.post('/private-beta/SDDSIP-827-returns/reported-check', (req, res) => {
  if(req.session.data['reported-check'] == 'Yes'){
      res.redirect('describe-work')
  } else if(req.session.data['reported-check'] == 'No'){
      res.redirect('check-your-answers')
  }  
});

router.post('/private-beta/SSDSIP-898-invoicing-flow-amends/responsible-for-invoice', function (req, res) {
  const editChoice = req.session.data['responsible-for-invoice-check']

  if (editChoice === 'applicant') {
    res.redirect('contact-details')
  } else if (editChoice === 'ecologist') {
    res.redirect('contact-details-ecologist')
  } else if (editChoice === 'someone-else') {
    res.redirect('invoice-name')
  } 
  
});


router.post('/private-beta/SSDSIP-898-invoicing-flow-amends/invoice-contact-details', (req, res) => {
  if(req.session.data['invoice-contact-details-check'] == 'Yes'){
      res.redirect('purchase-order')
  } else if(req.session.data['invoice-contact-details-check'] == 'No'){
      res.redirect('invoice-name')
  } 
});


router.post('/private-beta/SDDSIP-899-charging-flow-amends/paying-for-your-license-check', (req, res) => {
  if(req.session.data['sites-check'] == 'Yes'){
      res.redirect('reason')
  } else if(req.session.data['sites-check'] == 'No'){
      res.redirect('category')
  } 
});


router.post('/private-beta/SDDSIP-827-returns/v2/manage-licence-check', (req, res) => {
  if(req.session.data['manage-licence-check'] == 'Submit a return'){
      res.redirect('licensed-actions')
  } else if(req.session.data['manage-licence-check'] == 'View licence'){
      res.redirect('#')
  } else if(req.session.data['manage-licence-check'] == 'Renew licence'){
      res.redirect('#')
  } else if(req.session.data['manage-licence-check'] == 'Cancel licence'){
      res.redirect('#')
  }  
});


router.post('/private-beta/SDDSIP-827-returns/v2/licensed-actions-check', (req, res) => {
  if(req.session.data['licensed-actions-check'] == 'Yes'){
      res.redirect('outcome')
  } else if(req.session.data['licensed-actions-check'] == 'No'){
      res.redirect('why-not-carried-out')
  } 
});


router.post('/private-beta/SDDSIP-827-returns/v2/complete-between-dates-check', (req, res) => {
  if(req.session.data['complete-between-dates-check'] == 'Yes'){
      res.redirect('licensed-action-1')
  } else if(req.session.data['complete-between-dates-check'] == 'No'){
      res.redirect('work-start-date')
  } 
});


router.post('/private-beta/SDDSIP-827-returns/v2/create-artificial-sett-check', (req, res) => {
  if(req.session.data['create-artificial-sett-check'] == 'Yes'){
      res.redirect('describe-artificial-sett')
  } else if(req.session.data['create-artificial-sett-check'] == 'No'){
      res.redirect('why-no-artificial-sett')
  } 
});


router.post('/private-beta/SDDSIP-827-returns/v2/upload-check', (req, res) => {
  if(req.session.data['upload-check'] == 'Yes'){
      res.redirect('upload-file')
  } else if(req.session.data['upload-check'] == 'No'){
      res.redirect('check-your-answers')
  } 
});


router.post('/private-beta/SDDSIP-827-returns/v2/another-file-check', (req, res) => {
  if(req.session.data['another-file-check'] == 'Yes'){
      res.redirect('upload-another')
  } else if(req.session.data['another-file-check'] == 'No'){
      res.redirect('check-your-answers')
  } 
});


router.post('/private-beta/SDDSIP-827-returns/v2/licensed-action-4-check', (req, res) => {
  if(req.session.data['licensed-action-4-check'] == 'Yes'){
      res.redirect('destruction-date')
  } else if(req.session.data['licensed-action-4-check'] == 'No'){
      res.redirect('licensed-action-5')
  } 
});



router.post('/private-beta/SSDSIP-476-conservation-considerations/v4-mvp/on-or-within', (req, res) => {
  if(req.session.data['on-or-within-designated-site'] == 'Yes'){
      res.redirect('sites-start')
  } else if(req.session.data['on-or-within-designated-site'] == 'No'){
      res.redirect('check-your-answers-none')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v4-mvp/permission-check', (req, res) => {
  if(req.session.data['permission-check'] == 'Yes'){
      res.redirect('details-of-consent')
  } else if(req.session.data['permission-check'] == 'No'){
      res.redirect('advice')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v4-mvp/advice-check', (req, res) => {
  if(req.session.data['advice-check'] == 'Yes'){
      res.redirect('outcome')
  } else if(req.session.data['advice-check'] == 'No'){
      res.redirect('on-or-close')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v4-mvp/add-another-site-check', (req, res) => {
  if(req.session.data['add-another-site-check'] == 'Yes'){
      res.redirect('another-designated-site-name')
  } else if(req.session.data['add-another-site-check'] == 'No'){
      res.redirect('task-list-complete')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v4-mvp/another-permission-check', (req, res) => {
  if(req.session.data['another-permission-check'] == 'Yes'){
      res.redirect('another-details-of-consent')
  } else if(req.session.data['another-permission-check'] == 'No'){
      res.redirect('another-advice')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v4-mvp/another-advice-check', (req, res) => {
  if(req.session.data['another-advice-check'] == 'Yes'){
      res.redirect('another-outcome')
  } else if(req.session.data['another-advice-check'] == 'No'){
      res.redirect('another-on-or-close')
  } 
});


router.post('/private-beta/SSDSIP-476-conservation-considerations/v4-mvp/remove-site-check', (req, res) => {
  if(req.session.data['remove-site-check'] == 'Yes'){
      res.redirect('check-your-answers-none')
  } else if(req.session.data['remove-site-check'] == 'No'){
      res.redirect('sites-review-add-another')
  } 
});

router.post('/private-beta/SSDSIP-476-conservation-considerations/v4-mvp/remove-site-another-check', (req, res) => {
  if(req.session.data['remove-site-another-check'] == 'Yes'){
      res.redirect('sites-review-add-another')
  } else if(req.session.data['remove-site-another-check'] == 'No'){
      res.redirect('sites-another-review-add-another')
  } 
});


router.post('/private-beta/SDDSIP-827-returns/v3-mvp/manage-licence-check', (req, res) => {
  if(req.session.data['manage-licence-check'] == 'Submit a return'){
      res.redirect('licensed-actions')
  } else if(req.session.data['manage-licence-check'] == 'Email a copy of the licence'){
      res.redirect('carried-out-work')
  }  
});

router.post('/private-beta/SDDSIP-827-returns/v3-mvp/licensed-actions-check', (req, res) => {
  if(req.session.data['licensed-actions-check'] == 'Yes'){
      res.redirect('complete-between-dates')
  } else if(req.session.data['licensed-actions-check'] == 'No'){
      res.redirect('why-not-carried-out')
  } 
});


router.post('/private-beta/SDDSIP-827-returns/v3-mvp/complete-between-dates-check', (req, res) => {
  if(req.session.data['complete-between-dates-check'] == 'Yes'){
      res.redirect('licensed-action-1')
  } else if(req.session.data['complete-between-dates-check'] == 'No'){
      res.redirect('licensed-action-1')
  } 
});



}