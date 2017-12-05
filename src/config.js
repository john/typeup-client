export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  apiGateway: {
    URL: 'https://klwek6q560.execute-api.us-west-2.amazonaws.com/prod',
    REGION: 'us-west-2',
	ENV: 'prod'
  },
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID : 'us-west-2_5ldLb2NDF',
    APP_CLIENT_ID : '3mdl9o67bl36tv03c4818cvk9v',
    IDENTITY_POOL_ID: 'us-west-2:c49bfd30-8f18-4cf0-aa30-7ba20342d480',
  },
  s3: {
    BUCKET: 'typeup-attachments-prod-foo'
  }
};