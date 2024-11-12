## Overview
This Node.js express server is an example of how to manage Messaging authentication with Zendesk JWTs. This server expects to receive a [Zendesk Help Centre JWT](https://developer.zendesk.com/api-reference/help_center/help-center-api/help_center_jwts/). It will then extract the JWT attributes using the Zendesk public keys associated with the instance, returning a new signed JWT using details generated in Zendesk admin

## Additional Links

 - [Zendesk HC JWT API reference](https://developer.zendesk.com/api-reference/help_center/help-center-api/help_center_jwts/)
 - [Making third-party API requests with help center JWTs](https://developer.zendesk.com/documentation/help_center/help-center-api/secured-requests/#making-third-party-api-requests-with-help-center-jwts) developer documentation
 - [Authenticating end users for messaging](https://support.zendesk.com/hc/en-us/articles/4411666638746-Authenticating-end-users-for-messaging) support article
 - [Enabling authenticated visitors for messaging with Zendesk SDKs](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/enabling_auth_visitors/) developer documentation

Please reach out to your Zendesk contact for any support or guidance using this application

## Getting started

 - Clone and initialise the server on your local machine or external service
 - Set environment variables for the following:
	 - ZENDESK_DOMAIN
		 - the subdomain for your zendesk instance
	 - MESSAGING_AUTH_ID
		 - the [Key ID generated in Zendesk admin](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/enabling_auth_visitors/#generating-a-signing-key)
	 - MESSAGING_AUTH_KEY
		 - the Secret key generated in the same above step
 - Paste the code from `hcScript.js` into your Zendesk Guide theme `script.js` file
 - Install the Zendesk webwidget on your HC theme manually or via the "Automatically embed Web Widget in your help center" setting in the Messaging channel settings
Getting Started
