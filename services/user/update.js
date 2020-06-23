"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = async (event, context, callback) => {
  async function makeParams() {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    var params = {};

    if (data.cognitoUser) {
      params = {
        TableName: process.env.TABLE,
        Key: {
          id: event.pathParameters.id,
          sort: event.pathParameters.id,
        },
        ExpressionAttributeValues: {
          ":cognitoUser": data.cognitoUser,
          ":updatedAt": timestamp
        },
        UpdateExpression:
          "SET cognitoUser = :cognitoUser, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
      };
    }
    return params;
  }

  async function writeToDB() {
    const params = await makeParams();

    //Update the user in the DB
    try {
      const data = await dynamoDb.update(params).promise();
    } catch (error) {
      return {
        statusCode: 500,
        error: `Could not post: ${error.stack}`
      };
    }


    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify("Update operation success")
    };

    callback(null, response);
    return response;
  }

  var res = await writeToDB();
};
