"use strict";
const AWS = require("aws-sdk");
const speakeasy = require("speakeasy");

// Create the DynamoDB service object
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  console.log(event);

  //Auto confirm user and verify phone
  event.response.autoConfirmUser = true;
  event.response.autoVerifyPhone = true;

  try{
    var dbReturn = await writeToDB(event);
    return dbReturn;
  } catch(e) {
    throw e;
  }
};

// Write to DynamoDb with input as event and return same event if successful
async function writeToDB(event) {
  const timestamp = new Date().getTime();

  var userID = event.userName;
  var city = event.request.userAttributes["custom:city"];
  var firstname = event.request.userAttributes["custom:firstname"];
  var lastname = event.request.userAttributes["custom:lastname"];
  var phone = event.request.userAttributes.phone_number;

  const params = {
    TableName: process.env.TABLE,
    ReturnValues: "ALL_OLD",
    Item: {
      id: "user-" + userID,
      sort: "user",
      cognitoUser: {},
      city: city,
      cityItem: {},
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      isDriver: false,
      isDriverActive: false,
      vehicleType: "",
      deliveriesCompleted: 0,
      linkToS3: "NA",
      createdAt: timestamp.toString(),
      updatedAt: timestamp.toString(),
    },
  };

  console.log(params);

  try {
    const data = await dynamoDb.put(params).promise();
    return event;
  } catch (error) {
    return {
      statusCode: 400,
      error: `Could not post: ${error.stack}`,
    };
  }
}
