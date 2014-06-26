  - [apiCall()](#apicall)
  - [exports.getAllCompanies()](#exportsgetallcompaniessubdomainstringusernamestringpasswordorapitokenstringcallbackfunction)
  - [exports.getCompanyDetails()](#exportsgetcompanydetailssubdomainstringusernamestringpasswordorapitokenstringidintcallbackfunction)
  - [exports.getPerson()](#exportsgetpersonsubdomainstringusernamestringpasswordorapitokenstringidintcallbackfunction)
  - [exports.getProject()](#exportsgetprojectsubdomainstringusernamestringpasswordorapitokenstringidintcallbackfunction)
  - [exports.getPeopleInProject()](#exportsgetpeopleinprojectsubdomainstringusernamestringpasswordorapitokenstringidintcallbackfunction)
  - [exports.getIssue()](#exportsgetissuesubdomainstringusernamestringpasswordorapitokenstringprojectidintissueidintcallbackfunction)
  - [exports.getIssuesWaitingOnYou()](#exportsgetissueswaitingonyousubdomainstringusernamestringpasswordorapitokenstringcallbackfunction)
  - [exports.getReleaseBuildsForProject()](#exportsgetreleasebuildsforprojectsubdomainstringusernamestringpasswordorapitokenstringidintcallbackfunction)
  - [exports.getReleaseBuildInfo()](#exportsgetreleasebuildinfosubdomainstringusernamestringpasswordorapitokenstringidintcallbackfunction)
  - [exports.createReleaseBuildForProject()](#exportscreatereleasebuildforprojectsubdomainstringusernamestringpasswordorapitokenstringidintordernumbersstringtitlestringdescriptionstringemailbodystringuseridstoccstringcallbackfunction)
  - [exports.createFullReleaseBuild()](#exportscreatefullreleasebuildsubdomainstringusernamestringpasswordorapitokenstringidinttitlestringdescriptionstringemailbodystringcallbackfunction)

## apiCall()

  <p>A wrapper for performing all API calls.</p>

## exports.getAllCompanies(subdomain:string, username:string, passwordOrAPIToken:string, callback:Function)

  <p>Get a list of company ids and names in the account.</p>
  <p>The authenticated user must be an administrator or
  owner of the account.</p>

## exports.getCompanyDetails(subdomain:string, username:string, passwordOrAPIToken:string, id:int, callback:Function)

  <p>Get company details for the given company id. The
  response will also include all of the company&#39;s people
  and the number of active users.</p>
  <p>The authenticated user must be an administrator or
  owner of the account.</p>

## exports.getPerson(subdomain:string, username:string, passwordOrAPIToken:string, id:int, callback:Function)

  <p>Get the person with the given id.</p>
  <p>The authenticated user must be an administrator or
  owner of the account.</p>

## exports.getProject(subdomain:string, username:string, passwordOrAPIToken:string, id:int, callback:Function)

  <p>Get information about a project.</p>
  <p>The authenticated user must be an administrator or
  owner of the account.</p>

## exports.getPeopleInProject(subdomain:string, username:string, passwordOrAPIToken:string, id:int, callback:Function)

  <p>Get the list of all people with access to the project.</p>
  <p>The authenticated user must be an administrator or
  owner of the account.</p>

## exports.getIssue(subdomain:string, username:string, passwordOrAPIToken:string, projectId:int, issueId:int, callback:Function)

  <p>Get details on a given issue. Query by product and issue id.</p>

## exports.getIssuesWaitingOnYou(subdomain:string, username:string, passwordOrAPIToken:string, callback:Function)

  <p>Get a list of all the issues currently waiting on you</p>

## exports.getReleaseBuildsForProject(subdomain:string, username:string, passwordOrAPIToken:string, id:int, callback:Function)

  <p>Get all the release builds for a project.</p>

## exports.getReleaseBuildInfo(subdomain:string, username:string, passwordOrAPIToken:string, id:int, callback:Function)

  <p>Get the list of issues that are &quot;Ready for Next Release&quot; for
  the given project.</p>

## exports.createReleaseBuildForProject(subdomain:string, username:string, passwordOrAPIToken:string, id:int, orderNumbers:string, title:string, description:string, emailBody:string, userIdsToCc:string, callback:Function)

  <p>Create a release build for the specified project.</p>

## exports.createFullReleaseBuild(subdomain:string, username:string, passwordOrAPIToken:string, id:int, title:string, description:string, emailBody:string, callback:Function)

  <p>Create a release build for the specified project which encompasses <em>all</em> issues
  marked as <code>Ready for next release</code>. An email will be sent to all users in the project.</p>
  <p>The email body has limited templating capabilities. Put any of the following in the email
  body and it will be replaced with its corresponding value.</p>
  <ul>
  <li>{{Project Name}} =&gt; The name of the project</li>
  </ul>
