const axios = require("axios");
const moment = require("moment");
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

const call_options = {
  url: "http://66.135.211.96/services/search/FindingService/v1",
  date: new moment().add(5, "day").toISOString()
};

const auction_call_params = {
    "OPERATION-NAME": "findItemsAdvanced",
      "SERVICE-VERSION": "'1.0.0",
      "SECURITY-APPNAME": process.env.API_KEY,
      "RESPONSE-DATA-FORMAT": "JSON",
      "REST-PAYLOAD": "",
      "keywords": movie.upc,
      "itemFilter(0).name": "ListingType",
      "itemFilter(0).value(0)": "Auction",
      "itemFilter(1).name": "Currency",
      "itemFilter(1).value": "USD",
      "itemFilter(2).name": "FeedbackScoreMin",
      "itemFilter(2).value": "4",
      "itemFilter(3).name": "MaxPrice",
      "itemFilter(3).value": movie.maxPrice,
      "itemFilter(4).name": "EndTimeTo",
      "itemFilter(4).value": call_options.date,
      sortOrder: "PricePlusShippingLowest"
}

const fixed_call_params = {
    "OPERATION-NAME": "findItemsAdvanced",
      "SERVICE-VERSION": "'1.0.0",
      "SECURITY-APPNAME": process.env.API_KEY,
      "RESPONSE-DATA-FORMAT": "JSON",
      "REST-PAYLOAD": "",
      "keywords": movie.upc,
      "itemFilter(0).name": "ListingType",
      "itemFilter(0).value(0)": "FixedPrice",
      "itemFilter(1).name": "Currency",
      "itemFilter(1).value": "USD",
      "itemFilter(2).name": "FeedbackScoreMin",
      "itemFilter(2).value": "4",
      "itemFilter(3).name": "MaxPrice",
      "itemFilter(3).value": movie.maxPrice,
      "itemFilter(4).name": "EndTimeTo",
      "itemFilter(4).value": call_options.date,
      sortOrder: "PricePlusShippingLowest"
}

const params = {
  TableName: "movies"
};

const checkResponse = (data) => {
    return (data.findItemsAdvancedResponse[0].ack[0] === "Success" && data.findItemsAdvancedResponse[0].searchResult[0].@count !== "0") ? true : false
}

const getListings = (movies, parameter_list) => {
    return movies.map(movie => {
        return new Promise((resolve, reject) => {
            axios.get(call_options.url, {
                params: parameter_list
            }).then(res => {
                if(checkResponse(res.data)) {
                    resolve(res.data)
                }
            })
        })
    })
}



exports.handler = async event => {
  let res = await ddb.scan(params).promise();

    let movies = res.Items
    let auction_results = await Promise.all(getListings(movies, auction_call_params))
    let fixedPriceResults = await Promise.all(getListings(movies, fixed_call_params))



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
