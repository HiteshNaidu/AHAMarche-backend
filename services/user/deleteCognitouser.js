'use strict';
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = (event, context, callback) => {
    const params = {
        UserPoolId: process.env.USERPOOL, /* required */
        Username: event.pathParameters.id /* required */
    };

    cognito.adminDeleteUser(params, function (error, data) {
        // an error occurred
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                body: 'Couldn\'t remove the cognito user.',
            });
            return;
        }
        // successful response
        else {
            console.log(data);
            // create a response
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                body: 'Cognito user deleted successfully',
            };
            callback(null, response);
        }
    });
};