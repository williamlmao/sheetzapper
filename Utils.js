function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu("SheetZapper")
    .addItem("Current Account Balances", "getCurrentBalances")
    .addSeparator()
    .addItem("Set up daily import", "setUpDailyTrigger")
    .addItem("First time set up (Run this twice)", "setUp")
    .addToUi();
}

const writeDataToBottomOfTab = (tabName, data, clearTab) => {
  if (data.length === 0) {
    console.log("No data to write");
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.setActiveSheet(ss.getSheetByName(tabName));

  if (clearTab) {
    sheet.clear();
  }
  const lastRow = sheet.getLastRow() + 1;
  const lastColumn = sheet.getLastColumn() + 1;
  const rows = data.length;
  const cols = data[1].length;
  const writeResult = sheet.getRange(lastRow, 1, rows, cols).setValues(data);
  SpreadsheetApp.flush();
  return writeResult;
};

const cleanup = (sheetName) => {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  // Headers
  let headers = sheet.getRange("1:1").activate();
  headers
    .setBackground("#674ea7")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  // Alignment
  sheet.getRange("A:G").setHorizontalAlignment("left");
  //   Sort by date
  sheet.sort(1, false);
  //   Apply accounting format to
  sheet
    .getRange("I:J")
    .setNumberFormat(
      '_("$"* #,##0.00_);_("$"* \\(#,##0.00\\);_("$"* "-"??_);_(@_)'
    );
  // Important to apply this date formatting or else data studio may not pick it up
  sheet.getRange("A:A").setNumberFormat("M/d/yyyy H:mm:ss");
  sheet.getRange("H:H").setNumberFormat("#,##0.00");
};

const getWallets = () => {
  let wallets = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("Wallets")
    .getDataRange()
    .getValues()
    .flat();
  wallets.shift();
  return wallets;
};

function setUpDailyTrigger() {
  // SpreadsheetApp.getUi().alert("Triggers set up");
  // Ask user what time (GMT -5) they want to run the script
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    "What hour of the day would you like to run the script? (America/New_York Eastern Time). Please input an integer between 0 and 23. Your wallet balances will be pulled in each day at the specified time",
    ui.ButtonSet.OK_CANCEL
  );

  var time = response.getResponseText();
  if (time > 23 || time < 0 || time % 1 !== 0) {
    ui.alert(
      "Your input was not a valid integer between 0 and 23. Please try again."
    );
    return;
  }
  if (time == null) {
    return;
  }
  ScriptApp.newTrigger("getBalancesOnTrigger")
    .timeBased()
    .atHour(time)
    .everyDays(1)
    .inTimezone("America/New_York")
    .create();
  ui.alert(
    `Your trigger has been succesfully setup. Your wallet balances will be pulled in tomorrow at ${time}:00 Eastern Time`
  );
}

function setUp() {
  resetSheet("Current Balances");
  resetSheet("Balances Over Time");
  cleanup("Current Balances");
  cleanup("Balances Over Time");
  var ui = SpreadsheetApp.getUi();
  ui.alert("If you see this message, setup is complete");
}

function resetSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  sheet.clear();
  sheet.getRange("A1:J1").setValues(headers);
  SpreadsheetApp.flush();
  cleanup(sheetName);
}
