"use strict";

const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context, callback) => {
    async function makeParams() {
        const timestamp = new Date().getTime();
        const data = JSON.parse(event.body);

        const generateID = () => {
            var result = '';
            var numbers = '0123456789';
            var numbersLength = numbers.length;
            for (var i = 0; i < 10; i++) {
                result += numbers.charAt(Math.floor(Math.random() * numbersLength));
            }
            return result;
        }

        var id = generateID();
        var params = {
            TableName: process.env.TABLE,
            ReturnValues: "ALL_OLD",
            Item: {
                id: "item-" + id,
                sort: data.category,
                age: data.age,
                description: data.description,
                picturesLink: data.picturesLink,
                price: data.price,
                size: data.size,
                status: data.status,
                title: data.title,
                user: event.pathParameters.id,
                itemSold: false,
                createdAt: timestamp.toString(),
                updatedAt: timestamp.toString(),
            },
        };
        return params;
    }

    async function writeToDB() {
        const params = await makeParams();

        //Update the user in the DB
        try {
            const data = await dynamoDb.put(params).promise();
        } catch (error) {
            // create a response
            const response = {
                statusCode: 403,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                body: "Cannot post the item"
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
