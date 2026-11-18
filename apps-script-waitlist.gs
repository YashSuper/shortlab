function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Waitlist')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Waitlist');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Email', 'Segment']);
  }

  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), data.email || '', data.segment || '']);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
