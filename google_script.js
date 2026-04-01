function doGet(e) {
  var sheetDate = e.parameter.date;
  var sheetTime = e.parameter.time;
  var sheetTonnage = e.parameter.tonnage;
  var sheetLength = e.parameter.length;
  var sheetPieces = e.parameter.pieces;
  var sheetTimeSpent = e.parameter.timeSpent;
  var sheetWeight = e.parameter.weight;

  var spreadsheetId = 'AKfycbyMF6erPqZswJhqbVYvnHXhv2I4puRU5gxCfuUS7PE89kSM9rXLH0CRVVNF_6mrkgjQXg'; // Zmień na ID swojego arkusza
  var sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();

  sheet.appendRow([sheetDate, sheetTime, sheetTonnage, sheetLength, sheetPieces, sheetTimeSpent, sheetWeight]);

  var result = { "status": "success" };
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
