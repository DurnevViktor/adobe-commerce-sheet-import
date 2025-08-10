/**
 * Custom menu for importing products from Adobe Commerce.
 * Adds a top‑level menu called "Adobe Commerce" with an item to start the import.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Adobe Commerce')
    .addItem('Import Products', 'showImportDialog')
    .addToUi();
}

/**
 * Shows a modal dialog prompting the user for the Adobe Commerce domain and access token.
 * The dialog is defined in the ImportDialog.html file stored in this Apps Script project.
 */
function showImportDialog() {
  var html = HtmlService.createHtmlOutputFromFile('ImportDialog')
    .setWidth(400)
    .setHeight(250);
  SpreadsheetApp.getUi().showModalDialog(html, 'Import Adobe Commerce Products');
}

/**
 * Placeholder for the product import process.
 * Subsequent commits will implement the API call and populate the Catalog and Simple sheets.
 *
 * @param {string} domain The base domain of the Adobe Commerce store (e.g. "myshop.com").
 * @param {string} token  The Bearer token used for authenticating the API requests.
 */
function processImport(domain, token) {
  var ui = SpreadsheetApp.getUi();
  ui.alert('Import started. Product import implementation will be added in a later commit.');
}