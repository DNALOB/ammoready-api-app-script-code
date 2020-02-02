function apiQuery() {
  // Get data from the AmmoReady API for all keywords and target keywords
  var ammoReadyUrl = "https://app.ammoreadycloud.com/api/v1/orders";

  var username = "";
  var password = "";
  var headers = {
    contentType: "application/json",
    headers: {
      Authorization:
        "Basic " + Utilities.base64Encode(username + ":" + password)
    }
  };

  var results = [];

  var ammoReadyResponse = UrlFetchApp.fetch(ammoReadyUrl, headers);
  var metaData = JSON.parse(ammoReadyResponse);

  for (var j = 0; j < metaData.pages; j++) {
    var getDataForThisPage = UrlFetchApp.fetch(
      ammoReadyUrl + "?page=" + j,
      headers
    );
    var currentPageData = JSON.parse(getDataForThisPage);
    results.push(currentPageData.results);
  }

  var ordersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "orders"
  );

  // Write to Google Sheets
  ordersSheet.clear();
  ordersSheet.appendRow(["Date", "Price", "Order ID"]);

  for (var k = 0; k < results.length; k++) {
    for (var m = 0; m < results[k].length; m++) {
      ordersSheet.appendRow([
        results[k][m]["created_at"],
        results[k][m]["total_price"],
        results[k][m]["id"]
      ]);
    }
  }
}
