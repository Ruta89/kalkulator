function doGet(e) {
  var sheetDate = e.parameter.date;
  var sheetTime = e.parameter.time;
  var sheetTonnage = e.parameter.tonnage;
  var sheetLength = e.parameter.length;
  var sheetPieces = e.parameter.pieces;
  var sheetTimeSpent = e.parameter.timeSpent;
  var sheetWeight = e.parameter.weight;

  var spreadsheetId = 'TWOJ_ID_ARKUSZA_GOOGLE'; // Zmień na ID swojego arkusza
  var sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();

  sheet.appendRow([sheetDate, sheetTime, sheetTonnage, sheetLength, sheetPieces, sheetTimeSpent, sheetWeight]);

  var result = {"status": "success"};
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
