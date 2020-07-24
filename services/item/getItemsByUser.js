"use strict";
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();
var response = null;

module.exports.get = async (event, context, callback) => {
    console.log(event);

    var id = event.pathParameters.id;

    // Get from to DB here...
    var params = {
        TableName: process.env.TABLE,
        ExpressionAttributeValues: {
            ":id": {S: 'item-'},
            // ":user": id,
        },
        FilterExpression: "contains (id, :id)"
    };

    const data = await dynamoDb.scan(params).promise();
    console.log(data);

    if (data.Items) {
        // create a response
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify(data.Items),
        };
    } else {
        response = {
            statusCode: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: "No items found!"
        }
    };

    console.log(response);
    callback(null, response);

    return response;
};