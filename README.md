# README
This project is based on the most excellent [Serverless Stack Tutorial](http://serverless-stack.com/)

This is the front end React client to all the TypeUp APIs demos. All of the demos define the same API, so you can point this to any of them by changing config.js, and it should work.

npm install --save moment react-moment moment-timezone

### TODO:

- When you first sign up and Home.js loads, it's not getting users.

#### Features:
- Need to collect user's names when they sign up.
- API needs to verify auth before returning anything, if it's not already

- Front page should list all team members, with either their status, or "N/A"
  - John: building typeup
  - Bob: N/A

- Each user should only be able to have one status per day, and it should validate

- If you've already added your status for the day, the 'Add your status' button should becom 'Update status'



#### Code:
- How to get a list of all users in the pool?
- Do we need to have a 'Users' table in addition to the Cognito pool? Hope not.