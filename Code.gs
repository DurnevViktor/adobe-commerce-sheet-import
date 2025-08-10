function onOpen() {
  SpreadsheetApp.getUi().createMenu('Adobe Commerce')
    .addItem('Import Products', 'showImportDialog')
    .addToUi();
}

function showImportDialog() {
  // Placeholder function for import dialog
  SpreadsheetApp.getUi().alert('Import function not implemented yet.');
}
