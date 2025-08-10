function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Adobe Commerce')
    .addItem('Import Products', 'showImportDialog')
    .addToUi();
}

function showImportDialog() {
  var html = HtmlService.createHtmlOutputFromFile('ImportDialog')
    .setWidth(400)
    .setHeight(250);
  SpreadsheetApp.getUi().showModalDialog(html, 'Import Adobe Commerce Products');
}

// Placeholder for processImport, to be implemented in later commits
function processImport(domain, token) {
  SpreadsheetApp.getUi().alert('Import function not yet implemented.');
}
