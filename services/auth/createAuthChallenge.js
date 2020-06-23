"use strict";
const AWS = require("aws-sdk");
const speakeasy = require("speakeasy");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
var secretLoginCode = null;

module.exports.handler = async event => {
  var phone = event.request.userAttributes.phone_number;

  if (!event.request.session || !event.request.session.length) {
    // This is a new auth session

    const params = {
      TableName: process.env.TABLE,
      Key: {
        id: event.userName,
        sort: event.userName,
      }
    };
    var user = {};

    // fetch users from the database
    try {
      user = await dynamoDb.get(params).promise();
    } catch (error) {
      return {
        statusCode: 400,
        error: `Could not fetch from DB: ${error.stack}`
      };
    }

    // Generate TOTP for use with Google Authenticator for PROD Apps skip this step
    secretLoginCode = speakeasy.totp({
      secret: user.clientSecret,
      encoding: "base32"
    });

    try {
      console.log(secretLoginCode);
      const res = await sendSMS(phone, secretLoginCode, event.userName);

    } catch (err) {
      // Handle SMS Failure
      console.log(err);
    }
  } else {
    // There's an existing session. Don't generate new digits but
    // re-use the code from the current session. This allows the user to
    // make a mistake when keying in the code and to then retry, rather
    // than needing to text the user an all new code again.
    const previousChallenge = event.request.session.slice(-1)[0];
    secretLoginCode = previousChallenge.challengeMetadata.match(/CODE-(\d*)/)[1];
  }

  // This is sent back to the client app
  // Add the secret login code to the private challenge parameters
  // so it can be verified by the "Verify Auth Challenge Response" trigger
  event.response.privateChallengeParameters = { secretLoginCode };

  // Add the secret login code to the session so it is available
  // in a next invocation of the "Create Auth Challenge" trigger
  event.response.challengeMetadata = `CODE-${secretLoginCode}`;
  return event;
};

async function sendSMS(phone, code, userId) {
  // Set region
  AWS.config.update({ region: "us-east-1" });
  const params = {
    Message:
      "Your verification code to login into AHAMarche is " +
      code +
      ".\n\nAlternatively, use this link to login:\nhttp://ourdomainname/submitcode?userid=" + userId + "&otp=" +
      code,
    PhoneNumber: phone
  };
  return new AWS.SNS({ apiVersion: "2010-03-31" }).publish(params).promise();
}
