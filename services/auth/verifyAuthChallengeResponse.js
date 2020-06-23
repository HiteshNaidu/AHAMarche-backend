"use strict";
const AWS = require("aws-sdk");
const speakeasy = require("speakeasy");

// Create the DynamoDB service object
var dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async event => {
  // fetch users from the database
  var evt = await getDB(event);
  return evt;
};

async function getDB(event) {
  console.log(event);
  //Get from DB
  var user = {};
  const params = {
    TableName: process.env.TABLE,
    Key: {
      id: event.userName,
      sort: event.userName,
    }
  };

  try {
    user = await dynamoDb.get(params).promise();

    var clientSecret = user.clientSecret;

    // Verify a given token
    var tokenValidates = speakeasy.totp.verify({
      secret: clientSecret,
      encoding: "base32",
      token: event.request.challengeAnswer,
      window: 2
    });

    const expectedAnswer = event.request.privateChallengeParameters.secretLoginCode;
    if (tokenValidates) {
      event.response.answerCorrect = true;
    } else {
      event.response.answerCorrect = false;
    }
    return event;

  } catch (error) {
    console.log(error);
    return;
  } finally {




  }
}
