const getCurrentBalances = () => {
  resetSheet(currentBalancesSheetName);
  getBalances(currentBalancesSheetName);
};

const getBalancesOnTrigger = () => {
  getBalances(balancesOverTimeSheetName);
};

const getBalances = (destinationSheet) => {
  const date = new Date();
  const wallets = getWallets();
  wallets.forEach((wallet) => {
    try {
      const url = `https://api.zapper.fi/v1/balances?addresses%5B%5D=${wallet}&api_key=96e0cc51-a62e-42ca-acee-910ea7d2a241`;
      const response = UrlFetchApp.fetch(url).getContentText();
      // API response comes in weird, so need to clean it up to get to the data
      const result = processAPIResponse(response, wallet, date);
      writeDataToBottomOfTab(destinationSheet, result, false);
    } catch (e) {
      console.log(`Issue importing wallet ${wallet}:`, e.stack);
    }
  });
};

/**
 * Response comes in a stange format, so it needs to be parsed and then transformed into a 2D array
 * @param {*} response
 */
const processAPIResponse = (response, wallet, date) => {
  response = response.split("\n");
  let result = [];
  response.forEach((string) => {
    if (
      string.includes("data") &&
      string !== "data: start" &&
      string !== "data: end"
    ) {
      string = string.replace("data: ", "");
      let data = JSON.parse(string);
      let balances = data.balances;
      for (let wallet in balances) {
        if (balances[wallet].products.length > 0) {
          balances[wallet].products.forEach((product) => {
            let app = product["label"];
            let assets = product["assets"];
            assets.forEach((asset) => {
              let tokens = asset["tokens"];
              tokens.forEach((token) => {
                let row = [
                  date,
                  wallet,
                  token.network,
                  app,
                  token.type,
                  token.metaType ? token.metaType : "holding",
                  token.symbol,
                  token.balance,
                  token.price
                    ? token.balanceUSD
                    : token.balanceUSD / token.balanceRaw,
                  token.balanceUSD,
                ];
                result.push(row);
              });
            });
          });
        }
      }
    }
  });
  return result;
};
