/*
 * donedone-api
 * https://github.com/evsheffield/node-donedone-api
 *
 * Copyright (c) 2014 Evan Sheffield
 * Licensed under the MIT license.
 */

'use strict';

var https = require('https')
  , querystring = require('querystring');

/**
 * A wrapper for performing all API calls.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {string}   methodURL          The URL for the API action
 * @param  {string}   requestMethod      HTTP verb, e.g. 'GET' or 'POST'
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 * @param  {array}   data                Generic data (optional)
 * @param  {array}   attachments         List of file paths (optional)
 *
 * @throws {Error} If the HTTP request results in an error.
 */
var apiCall = function(subdomain, username, passwordOrAPIToken, methodURL, requestMethod, callback, data, attachments) {
  var baseUrl = subdomain + '.mydonedone.com'
    , path = '/issuetracker/api/v2/' + methodURL
    , auth = new Buffer(username + ':' + passwordOrAPIToken).toString('base64')
    , options = {
        hostname: baseUrl,
        path: path,
        method: requestMethod,
        headers: {
          Authorization: 'Basic ' + auth
        }
      };

  if(data) {
    data = querystring.stringify(data);
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.headers['Content-Length'] = Buffer.byteLength(data);
  }

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(respData) {
      var respJson = JSON.parse(respData);

      // Non-200 responses are API errors. Execute the callback with the error message.
      if(200 !== res.statusCode) {
       var errMsg = 'HTTP Error ' + res.statusCode + ', Message: ' + respJson.Message;
       if(callback) {
        callback(errMsg);
       }
      }
      else {
        if(callback) {
          callback(null, respJson);
        }
      }
    });
  });

  // Write the POST data
  if(data) {
    req.write(data);
  }
  req.end();

  req.on('error', function(e) {
    callback(e);
  });
};

// -----------------------------------------------------
// Companies and People
// -----------------------------------------------------

/**
 * Get a list of company ids and names in the account.
 *
 * The authenticated user must be an administrator or
 * owner of the account.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 *
 * @throws {Error} If the HTTP request results in an error.
 */
exports.getAllCompanies = function(subdomain, username, passwordOrAPIToken, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'companies.json', 'GET', callback);
}

/**
 * Get company details for the given company id. The
 * response will also include all of the company's people
 * and the number of active users.
 *
 * The authenticated user must be an administrator or
 * owner of the account.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {int}      id                 The company id
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 *
 * @throws {Error} If the HTTP request results in an error.
 */
exports.getCompanyDetails = function(subdomain, username, passwordOrAPIToken, id, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'companies/' + id + '.json', 'GET', callback);
}

/**
 * Get the person with the given id.
 *
 * The authenticated user must be an administrator or
 * owner of the account.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {int}      id                 The person id
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 *
 * @throws {Error} If the HTTP request results in an error.
 */
exports.getPerson = function(subdomain, username, passwordOrAPIToken, id, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'people/' + id + '.json', 'GET', callback);
}


// -----------------------------------------------------
// Release Builds
// -----------------------------------------------------

/**
 * Get all the release builds for a project.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {int}      id                 The project id
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 *
 * @throws {Error} If the HTTP request results in an error.
 */
exports.getReleaseBuildsForProject = function(subdomain, username, passwordOrAPIToken, id, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'projects/' + id + '/release_builds.json', 'GET', callback);
}

/**
 * Get the list of issues that are "Ready for Next Release" for
 * the given project.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {int}      id                 The project id
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 *
 * @throws {Error} If the HTTP request results in an error.
 */
exports.getReleaseBuildInfo = function(subdomain, username, passwordOrAPIToken, id, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'projects/' + id + '/release_builds/info.json', 'GET', callback);
}

/**
 * Create a release build for the specified project.
 *
 * The POST data object should have the following fields:
 *  - `order_numbers` (string, required) - Comma-delimited list of issue numbers to include.
 *  - `title` (string, required) - Title for the release build.
 *  - `description` (string, optional) - Description for the release build.
 *  - `email_body` (string, optional) - An email message to be sent to users.
 *  - `user_ids_to_cc` (string, optional) - Comma-delimited list of user ids to send email notifications to.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {int}      id                 The project id
 * @param  {object}   data               POST data specifying details about the build
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 *
 * @throws {Error} If the HTTP request results in an error.
 */
exports.createReleaseBuildForProject = function(subdomain, username, passwordOrAPIToken, id, data, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'projects/' + id + '/release_builds.json', 'POST', callback, data);
}
