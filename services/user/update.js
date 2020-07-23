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
    else if (data.cityItem) {
      params = {
        TableName: process.env.TABLE,
        Key: {
          id: event.pathParameters.id,
          sort: event.pathParameters.id,
        },
        ExpressionAttributeValues: {
          ":cityItem": data.cityItem,
          ":updatedAt": timestamp
        },
        UpdateExpression:
          "SET cityItem = :cityItem, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
      };
    }
    else if (data.city) {
      params = {
        TableName: process.env.TABLE,
        Key: {
          id: event.pathParameters.id,
          sort: event.pathParameters.id,
        },
        ExpressionAttributeValues: {
          ":city": data.city,
          ":updatedAt": timestamp
        },
        UpdateExpression:
          "SET city = :city, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
      };
    }
    else if (data.isDriver) {
      params = {
        TableName: process.env.TABLE,
        Key: {
          id: event.pathParameters.id,
          sort: event.pathParameters.id,
        },
        ExpressionAttributeValues: {
          ":isDriver": data.isDriver,
          ":updatedAt": timestamp
        },
        UpdateExpression:
          "SET isDriver = :isDriver, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
      };
    }
    else if (data.vehicleType) {
      params = {
        TableName: process.env.TABLE,
        Key: {
          id: event.pathParameters.id,
          sort: event.pathParameters.id,
        },
        ExpressionAttributeValues: {
          ":vehicleType": data.vehicleType,
          ":updatedAt": timestamp
        },
        UpdateExpression:
          "SET vehicleType = :vehicleType, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
      };
    }
    else if (data.isDriverActive) {
      params = {
        TableName: process.env.TABLE,
        Key: {
          id: event.pathParameters.id,
          sort: event.pathParameters.id,
        },
        ExpressionAttributeValues: {
          ":isDriverActive": data.isDriverActive,
          ":updatedAt": timestamp
        },
        UpdateExpression:
          "SET isDriverActive = :isDriverActive, updatedAt = :updatedAt",
        ReturnValues: "ALL_NEW"
      };
    }
    else if (!data.isDriverActive) {
      params = {
        TableName: process.env.TABLE,
        Key: {
          id: event.pathParameters.id,
          sort: event.pathParameters.id,
        },
        ExpressionAttributeValues: {
          ":isDriverActive": data.isDriverActive,
          ":updatedAt": timestamp
        },
        UpdateExpression:
          "SET isDriverActive = :isDriverActive, updatedAt = :updatedAt",
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
