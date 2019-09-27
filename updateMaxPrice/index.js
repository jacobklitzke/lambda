const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async event => {
  const params = {
    TableName: "movies",
    Key: {
      _id: { S: event.input.path }
    },
    ReturnValues: "UPDATED_NEW",
    ExpressionAttributeNames: {
      "#MP": "maxPrice"
    },
    ExpressionAttributeValues: {
      ":mp": { S: event.body.maxPrice }
    },
    UpdateExpression: "SET #MP = :mp"
  };

  let res = await ddb.updateItem(params).promise();
  if (Object.keys(res).length !== 0) {
    const response = {
      statusCode: 200,
      body: JSON.stringify("Update Successful!")
    };
    return response;
  } else {
    const response = {
      statusCode: 200,
      body: JSON.stringify("Update Unsuccessful")
    };
    return response;
  }
};
