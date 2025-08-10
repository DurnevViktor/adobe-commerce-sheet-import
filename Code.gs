function onOpen() {
  SpreadsheetApp.getUi().createMenu('Adobe Commerce')
    .addItem('Import Products', 'showImportDialog')
    .addToUi();
}

function showImportDialog() {
  var html = HtmlService.createHtmlOutputFromFile('ImportDialog')
    .setWidth(400)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'Import Products');
}
