"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = async (event, context, callback) => {
    async function makeParams() {
        const timestamp = new Date().getTime();
        const data = JSON.parse(event.body);
        var params = {};

        if (data.itemSold) {
            params = {
                TableName: process.env.TABLE,
                Key: {
                    id: event.pathParameters.id,
                    sort: data.category,
                },
                ExpressionAttributeValues: {
                    ":itemSold": data.itemSold,
                    ":updatedAt": timestamp
                },
                UpdateExpression:
                    "SET itemSold = :itemSold, updatedAt = :updatedAt",
                ReturnValues: "ALL_NEW"
            };
        }
        // else if (data.cityItem) {
        //   params = {
        //     TableName: process.env.TABLE,
        //     Key: {
        //       id: event.pathParameters.id,
        //       sort: "user",
        //     },
        //     ExpressionAttributeValues: {
        //       ":cityItem": data.cityItem,
        //       ":updatedAt": timestamp
        //     },
        //     UpdateExpression:
        //       "SET cityItem = :cityItem, updatedAt = :updatedAt",
        //     ReturnValues: "ALL_NEW"
        //   };
        // }
        return params;
    }

    async function writeToDB() {
        const params = await makeParams();
        console.log(params);

        //Update the user in the DB
        try {
            const data = await dynamoDb.update(params).promise();
        } catch (error) {
            // create a response
            const response = {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify(`Could not post: ${error.stack}`)
            };

            callback(null, response);
            return response;
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
