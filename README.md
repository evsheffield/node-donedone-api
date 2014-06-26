# donedone-api

> A wrapper for [DoneDone](http://www.getdonedone.com/) API 2.0

This module is a work-in-progress. Currently only a small subset of the API functions
are availble. You can view the full documentation for the DoneDone API [here](http://www.getdonedone.com/api/).

## Installation
`npm install donedone-api`

## Usage
```javascript
var donedone_api = require('donedone-api');
var allCompanies = donedone_api.getAllCompanies(...);
```

## Documentation
Please refer to the `docs` folder for detailed API documentation.

## CLI
First, make sure to install this module globally.

`npm install donedone-api -g`

A set of command-line tools should then be available by running:

`donedone`

To get the list of commands available, use `donedone --help`.

Every command has three required options:

```
-s, --subdomain [string]    The DoneDone subdomain
-u, --username  [string]    The DoneDone username
-p, --password  [string]    The DoneDone password or API key
```

You may be thinking, "Gosh, I really wish I didn't have to enter all of those every time." Well you're in luck!
You can create a JSON file named `.donedonerc` in the directory that you're running `donedone`.

```
{
  "subdomain": "mycompany",
  "username": "myusername",
  "password": "*****"
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- v0.1.2 Remove 'Test Project' project name from default release build email body, template with correct project name.
Refactored to handle chunked data responses to API calls.
- v0.1.1 Fix hardcoded user id that messed up release builds
- v0.1.0 Initial release, add functions for companies & people and release builds. CLI available for "full" release builds.

## License
Copyright (c) 2014 Evan Sheffield  
Licensed under the MIT license.
