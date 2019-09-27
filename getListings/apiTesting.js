const axios = require("axios");
const moment = require("moment");

const call_options = {
  url: "http://66.135.211.96/services/search/FindingService/v1",
  date: new moment().add(5, "day").toISOString()
};

axios
  .get(call_options.url, {
    params: {
      "OPERATION-NAME": "findItemsAdvanced",
      "SERVICE-VERSION": "'1.0.0",
      "SECURITY-APPNAME": "aaa",
      "RESPONSE-DATA-FORMAT": "JSON",
      "REST-PAYLOAD": "",
      keywords: "0031398258384",
      "itemFilter(0).name": "ListingType",
      "itemFilter(0).value(0)": "FixedPrice",
      "itemFilter(1).name": "Currency",
      "itemFilter(1).value": "USD",
      "itemFilter(2).name": "FeedbackScoreMin",
      "itemFilter(2).value": "4",
      "itemFilter(3).name": "MaxPrice",
      "itemFilter(3).value": "11.00",
      sortOrder: "PricePlusShippingLowest"
    }
  })
  .then(res => {
    console.log(res);
  })
  .catch(error => console.log(error.message));
