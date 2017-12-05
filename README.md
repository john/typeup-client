# README
This is the front end client, written in React, to the AWS Startup Kit TypeUp app, which can be configured to run with any of the TypeUp kit API demos. All of the demos define the same endpoints, so you can point this to any of them by changing config.js, and it should Just Work™.

### Installing locally
- Make sure you have node and npm installed. Here are links to guides for installing on [Mac OS](https://treehouse.github.io/installation-guides/mac/node-mac.html), [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows), and [Linux](http://blog.teamtreehouse.com/install-node-js-npm-linux) 
- Clone the repo into a local directory:
  - `git clone git@github.com:john/typeup-client.git`
  - `cd typeup-api-serverless`
- Install dependencies: `npm install`
- Run the app locally: `npm start`

### Configuration
- Create a [Cognito User Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/create-new-user-pool-console-quickstart.html). You can change the defaults to suit your needs, but accepting the defaults will work. Edit config.js to fill in REGION and USER_POOL_ID

- In the 'general settings' area of your user pool, click 'add app client'. Unclick "generate client secret," as they're not supported by the Javascript SDK. Check "Enable sign-in API." Finish, then get the APP_CLIENT_ID and add to config.js

- Create an [Identity Pool](https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html). In the 'Authentication providers' section, enter the user pool ID and app client id from the previous step, then click 'Create pool.'

- On next page click 'Show details,' and enter policy info from: https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html

- When prompted, let cognito create a new role for the identitypool. When done, click 'Sample code' in the left nav, copy the Identity pool ID from the code samples, and add it to config.js

- You need to get the base URL of your API Gateway and put that in config.js as well. Instructions for deploying the demo APIs can be found in their respective repos ([Serverless](https://github.com/john/typeup-api-serverless)), the README for each API has instructions for finding the API Gateway URL once deployed.
- Deploying the API creates an S3 bucket for file uploads. After deploying get the name of the bucket, and add it to the client's config.js

### Deploying remotely
- Package the app for production: `npm run build`
- Push to an S3 bucket: `aws s3 sync build/ s3://YOUR_S3_DEPLOY_BUCKET_NAME`
- [Configure your deployment S3 bucket as a static website](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/static-website-hosting.html).
- *Optional*: configure a CloudFront distribution to speed up loading of your site.
- *Optional*: [Configure a custom domain](https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html) to point to either your S3 bucket or CloudFront distribution.

### TODO
- When you first sign up and Home.js loads, it's not getting users unless you reload
- API needs to verify auth before returning anything, if it's not already
- Disappear 'more' link when there isn't any more
- Add back blocked/unblocked

#### Features
- Groups
- SES




#### Code:
- How to get a list of all users in the pool?
- Do we need to have a 'Users' table in addition to the Cognito pool? Hope not.

#### Thanks
This project is based on the most excellent [Serverless Stack Tutorial](http://serverless-stack.com/)