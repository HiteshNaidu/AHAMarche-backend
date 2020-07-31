"use strict";

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");

// Set region
const sns = new AWS.SNS({ region: "us-east-1" });

module.exports.handler = async (event, context, callback) => {
    const data = JSON.parse(event.body);

    var params = {
        Message: "AHAMarché: Hi " + data.sellerName + " a user wants to buy the " + data.item + " you've uploaded to AHAMarché.\nInterested person's name: " +
            data.userName + "\nInterested person's phone: " + data.phone + "\nPlease contact the person directly for further discussion. Thank you!", /* required */
        PhoneNumber: event.pathParameters.id,
    };

    // Fetch users from the database
    try {
        await sns.publish(params).promise();

        // create a response
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: "Demo text message published successfully"
        };
        console.log(response);
        callback(null, response);

        return response;
    } catch (error) {
        // create a response
        const response = {
            statusCode: 403,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: "Demo text message published successfully"
        };
        console.log(response);
        callback(null, response);

        return response;
    }
};