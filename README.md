# README
This project is based on the most excellent [Serverless Stack Tutorial](http://serverless-stack.com/)

This is the front end React client to all the TypeUp APIs demos. All of the demos define the same API, so you can point this to any of them by changing config.js, and it should work.

### Install locally
- Install the [AWS command line tools](https://docs.aws.amazon.com/cli/latest/userguide/installing.html), if you're going to be deploying the app on S3/Cloudfront:
  - If it's not already on your system, install pip. On Mac first install XCode command line tools, then: `sudo easy_install pip`
  - 
- If you haven't already, install node and npm. Guide for installation on Mac [here](https://treehouse.github.io/installation-guides/mac/node-mac.html)
- Clone the repo into a local directory:
  - `git clone git@github.com:john/typeup-client.git`
  - `cd typeup-api-serverless`
- Install dependencies: `npm install`
- Run the app locally: `npm start`

### Deploy
- Package the app for production: `npm run build`
- push to an S3 bucket: `aws s3 sync build/ s3://YOUR_S3_DEPLOY_BUCKET_NAME`

### Configuration
- You need to get the base URL of your API Gateway and put it in config.js

### TODO:

- When you first sign up and Home.js loads, it's not getting users (or at least not showing you right after you sign up)

#### Features:

- API needs to verify auth before returning anything, if it's not already


#### Code:
- How to get a list of all users in the pool?
- Do we need to have a 'Users' table in addition to the Cognito pool? Hope not.