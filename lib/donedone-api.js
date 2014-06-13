/*
 * donedone-api
 * https://github.com/evsheffield/node-donedone-api
 *
 * Copyright (c) 2014 Evan Sheffield
 * Licensed under the MIT license.
 */

'use strict';

var https = require('https');

/**
 * A wrapper for performing all API calls.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {string}   methodURL          The URL for the API action
 * @param  {string}   requestMethod      HTTP verb, e.g. 'GET' or 'POST'
 * @param  {Function} callback           Callback function to execute when the request completes
 * @param  {array}   data                Generic data (optional)
 * @param  {array}   attachments         List of file paths (optional)
 *
 * @throws {Error} If the HTTP request results in an error.
 */
var apiCall = function(subdomain, username, passwordOrAPIToken, methodURL,requestMethod, callback, data, attachments) {
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

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(data) {
      if(callback) {
        callback(JSON.parse(data));
      }
    });
  });
  req.end();

  req.on('error', function(e) {
    throw new Error(e);
  });
};

/**
 * Get a list of company ids and names in the account.
 *
 * The authenticated user must be an administrator or
 * owner of the account.
 *
 * @param  {string}   subdomain          The DoneDone subdomain, e.g. 'foobar' in 'foobar.mydonedone.com'
 * @param  {string}   username           DoneDone username
 * @param  {string}   passwordOrAPIToken DoneDone password or API token
 * @param  {Function} callback           Callback function to execute when the request completes
 *
 * @throws {Error} If the HTTP request results in an error.
 */
exports.getAllCompanies = function(subdomain, username, passwordOrAPIToken, callback) {
  apiCall(subdomain, username, passwordOrAPIToken, 'companies.json', 'GET', callback);
}
