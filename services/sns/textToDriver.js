"use strict";

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");

// Set region
const sns = new AWS.SNS({ region: "us-east-1" });

module.exports.handler = async (event, context, callback) => {
    const data = JSON.parse(event.body);
    console.log(event);

    var params = {
        Message: "AHAMarché Driver(" + data.city + "): Hi, a new delivery has been assigned to you.\nItem: " + data.item + "\nSeller's name and phone: " +
            data.sellerName + ", " + data.sellerPhone + "\nSeller's location: " + (data.sellerLocation.latitude) + ", " + (data.sellerLocation.longitude) +
            "\n\nBuyer's name and phone: " + data.buyerName + ", " + data.buyerPhone + "\nBuyer's location: " + (data.buyerLocation.latitude) + ", " +
            (data.buyerLocation.longitude) + "\n\nDelivery Pay: $" + data.price + "\n\nPlease contact the buyer and the seller for further details.", /* required */
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
            body: "Text message to driver published successfully"
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
            body: "Failed"
        };
        console.log(response);
        callback(null, response);

        return response;
    }
};