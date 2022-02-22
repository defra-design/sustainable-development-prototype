// Core dependencies
const url = require('url')

// Local dependencies
const config = require('../../../app/config')
const encryptPassword = require('../../utils').encryptPassword

// Local variables
const allowedPathsWhenUnauthenticated = [
  '/prototype-admin/password',
  '/public/stylesheets/unbranded.css',
  '/public/stylesheets/unbranded-ie8.css']

module.exports = function (req, res, next) {
  if (!shouldUseAuth()) {
    next()
  } else if (!process.env.PASSWORD) {
    showNoPasswordError(res)
  } else if (allowedPathsWhenUnauthenticated.includes(req.path)) {
    next()
  } else if (sessionIsAuthenticated(req)) {
    next()
  } else {
    sendUserToPasswordPage(req, res)
  }
}

function shouldUseAuth () {
  const useAuth = (process.env.USE_AUTH || config.useAuth || 'not set').toLowerCase()
  if (useAuth !== 'true') {
    return false
  }

  const isRunningInGlitch = process.env.PROJECT_REMIX_CHAIN !== undefined
  if (isRunningInGlitch) {
    return true
  }

  const safeNodeEnv = process.env.NODE_ENV || 'not set'
  const isRunningInProduction = safeNodeEnv.toLowerCase() === 'production'
  if (isRunningInProduction) {
    return true
  }
  return false
}

function showNoPasswordError (res) {
  console.error('Password is not set.')
  return res.send('<h1>Error:</h1><p>Password not set. <a href="https://govuk-prototype-kit.herokuapp.com/docs/publishing-on-heroku#6-set-a-password">See guidance for setting a password</a>.</p>')
}

function sendUserToPasswordPage (req, res) {
  const returnURL = url.format({
    pathname: req.path,
    query: req.query
  })
  const passwordPageURL = url.format({
    pathname: '/prototype-admin/password',
    query: { returnURL }
  })
  res.redirect(passwordPageURL)
}

function sessionIsAuthenticated (req) {
  // password is encrypted because we may store it in a cookie
  // we store the password to compare in case it is changed server-side
  // changing the password should require users to re-authenticate
  const password = encryptPassword(process.env.PASSWORD)
  return req.session && req.session.authentication === password
}
