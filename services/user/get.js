"use strict";
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = async (event, context, callback) => {
  const params = {
    TableName: process.env.TABLE,
    Key: {
      id: event.pathParameters.id,
      sort: event.pathParameters.id,
    }
  };
  var data = {};

  // Fetch users from the database
  try {
    data = await dynamoDb.get(params).promise();

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(data.Item)
    };
    callback(null, response);

    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "No users found!"
    };
    callback(null, response);
    return response
  }
};
