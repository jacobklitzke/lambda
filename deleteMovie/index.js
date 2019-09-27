const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = async event => {
  const params = {
    TableName: "movies",
    Key: {
      _id: {
        S: event.input.path
      }
    },
    ReturnValues: "ALL_OLD"
  };

  let res = await ddb.deleteItem(params).promise();
  if (Object.keys(res).length !== 0) {
    const response = {
      statusCode: 200,
      body: JSON.stringify("Deletion Successful!")
    };
    return response;
  } else {
    const response = {
      statusCode: 200,
      body: JSON.stringify("Deletion Unsuccessful")
    };
    return response;
  }
};
