# donedone-api

> A wrapper for [DoneDone](http://www.getdonedone.com/) API 2.0

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
A set of command-line tools is also available by running:

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
_(Nothing yet)_

## License
Copyright (c) 2014 Evan Sheffield  
Licensed under the MIT license.
