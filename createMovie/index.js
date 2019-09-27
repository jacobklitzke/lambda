const ObjectID = require("bson-objectid");
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async event => {
  const params = {
    TableName: "movies",
    Item: {
      _id: { S: ObjectID().toHexString() },
      title: { S: event.body.title },
      upc: { S: event.body.upc },
      maxPrice: { S: event.body.maxPrice }
    }
  };

  await ddb.putItem(params).promise();

  const response = {
    statusCode: 200,
    body: JSON.stringify("Deletion Successful!")
  };
  return response;
};
