export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  apiGateway: {
    URL: 'https://e50jy3zr3e.execute-api.us-west-2.amazonaws.com/prod',
    REGION: 'us-west-2',
  },
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID : 'us-west-2_7TooDx4yJ',
    APP_CLIENT_ID : '2sdk53svubdtll8gigcscjb0an',
    IDENTITY_POOL_ID: 'us-west-2:a29de7a9-b998-43cf-913d-201086b4442e',
  },
  s3: {
    BUCKET: 'attachments345-prod'
  }
};