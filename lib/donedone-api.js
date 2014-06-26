/*
 * donedone-api
 * https://github.com/evsheffield/node-donedone-api
 *
 * Copyright (c) 2014 Evan Sheffield
 * Licensed under the MIT license.
 */

'use strict';

var https = require('https')
  , querystring = require('querystring')
  , async = require('async')
  , _ = require('lodash');

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
 */
exports.getAllCompanies = function(subdomain, username, passwordOrAPIToken, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'companies.json', 'GET', callback);
};

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
 */
exports.getCompanyDetails = function(subdomain, username, passwordOrAPIToken, id, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'companies/' + id + '.json', 'GET', callback);
};

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
 */
exports.getPerson = function(subdomain, username, passwordOrAPIToken, id, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'people/' + id + '.json', 'GET', callback);
};

// -----------------------------------------------------
// Projects
// -----------------------------------------------------

/**
 * Get the list of all people with access to the project.
 *
 * The authenticated user must be an administrator or
 * owner of the account.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {int}      id                 The project id
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 */
exports.getPeopleInProject = function(subdomain, username, passwordOrAPIToken, id, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'projects/' + id + '/people.json', 'GET', callback);
};

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
 */
exports.getReleaseBuildsForProject = function(subdomain, username, passwordOrAPIToken, id, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'projects/' + id + '/release_builds.json', 'GET', callback);
};

/**
 * Get the list of issues that are "Ready for Next Release" for
 * the given project.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {int}      id                 The project id
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 */
exports.getReleaseBuildInfo = function(subdomain, username, passwordOrAPIToken, id, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'projects/' + id + '/release_builds/info.json', 'GET', callback);
};

/**
 * Create a release build for the specified project.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {int}      id                 The project id
 * @param  {string}   orderNumbers       Comma-delimited list of issue numbers to include
 * @param  {string}   title              Title for the release build
 * @param  {string}   description        Description for the release build
 * @param  {string}   emailBody          An email message to be sent to users
 * @param  {string}   userIdsToCc        Comma-delimited list of user ids to send email notifications to.
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 */
exports.createReleaseBuildForProject = function(subdomain, username, passwordOrAPIToken, id, orderNumbers, title, description, emailBody, userIdsToCc, callback) {
  var data = {};

  if(orderNumbers) {
    data['order_numbers'] = orderNumbers;
  }
  if(title) {
    data['title'] = title;
  }
  if(description) {
    data['description'] = description;
  }
  if(emailBody) {
    data['email_body'] = emailBody;
  }
  if(userIdsToCc) {
    data['user_ids_to_cc'] = userIdsToCc;
  }

  apiCall(subdomain, username, passwordOrAPIToken, 'projects/' + id + '/release_builds.json', 'POST', callback, data);
};

/**
 * Create a release build for the specified project which encompasses *all* issues
 * marked as `Ready for next release`. An email will be sent to all users in the project.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {int}      id                 The project id
 * @param  {string}   title              Title for the release build
 * @param  {string}   description        Description for the release build
 * @param  {string}   emailBody          An email message to be sent to users
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 */
exports.createFullReleaseBuild = function(subdomain, username, passwordOrAPIToken, id, title, description, emailBody, callback) {

  var orderNumbers
    , userIdsToCc;

  async.waterfall([
    // Get release build information
    function(cb) {
      exports.getReleaseBuildInfo(subdomain, username, passwordOrAPIToken, id, function(err, respData) {
        cb(err, respData);
      });
    },
    // Get people in the project
    function(releaseBuildInfo, cb) {
      orderNumbers = releaseBuildInfo.order_numbers_ready_for_next_release.join(',');
      // Trigger an error when there are no issues that are ready to release
      if('' === orderNumbers) {
        cb('Cannot create release build, there are no issues marked as "Ready for Next Release".');
      }
      else {
        exports.getPeopleInProject(subdomain, username, passwordOrAPIToken, id, function(err, respData) {
          cb(err, respData);
        });
      }
    },
    // Create a release build for the retrieved items, sent to the indicated people
    function(peopleInProject, cb) {
      userIdsToCc = _.pluck(peopleInProject, 'id').join(',');
      exports.createReleaseBuildForProject(subdomain, username, passwordOrAPIToken, id, orderNumbers, title, description, emailBody, userIdsToCc, function(err, respData) {
        cb(err, respData);
      });
    }
  ], function(err, results) {
    callback(err, results);
  });
};

// -----------------------------------------------------
// Issues Waiting On You
// -----------------------------------------------------

/**
 * Get a list of all the issues currently waiting on you
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 */

exports.getIssuesWaitingOnYou = function(subdomain, username, passwordOrAPIToken, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'issues/' + '/waiting_on_you.json', 'GET', callback);
};

// -----------------------------------------------------
// Get Issue
// -----------------------------------------------------

/**
 * Get details on a given issue. Query by product and issue id.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {Function} callback           Callback function with two arguments `(err, data)`
 */

exports.getIssue = function(subdomain, username, passwordOrAPIToken, project, issue, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'projects/' + project + '/issues/' + issue + ".json", 'GET', callback);
};


