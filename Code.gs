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
/**
 * Fetches all products from Adobe Commerce using the REST API.
 * Products are retrieved in pages of `pageSize` items until no more results are returned.
 *
 * @param {string} domain The base domain of the Adobe Commerce store (e.g. "myshop.com").
 * @param {string} token  The Bearer token used for authenticating the API requests.
 * @return {Array<Object>} An array of product objects returned by the API.
 */
function fetchAllProducts(domain, token) {
  var pageSize = 100;
  var page = 1;
  var allItems = [];
  var slash = String.fromCharCode(47); // avoid writing '/' directly in Apps Script editor
  while (true) {
    var url =
      'https://' +
      domain +
      slash +
      'rest' +
      slash +
      'V1' +
      slash +
      'products?searchCriteria[currentPage]=' +
      page +
      '&searchCriteria[pageSize]=' +
      pageSize;
    var options = {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      muteHttpExceptions: true,
    };
    var response = UrlFetchApp.fetch(url, options);
    var data = JSON.parse(response.getContentText());
    if (data && data.items && data.items.length > 0) {
      allItems = allItems.concat(data.items);
      if (data.items.length < pageSize) {
        // reached the last page
        break;
      }
      page++;
    } else {
      break;
    }
  }
  return allItems;
}

/**
 * Imports products from Adobe Commerce into the "Catalog" sheet.
 * Fetches all products via the REST API and writes selected fields to the sheet.
 * Existing data in the sheet will be cleared before writing new data.
 *
 * @param {string} domain The base domain of the Adobe Commerce store.
 * @param {string} token  The Bearer token used for authenticating the API requests.
 */
function processImport(domain, token) {
  var ui = SpreadsheetApp.getUi();
  try {
    // Retrieve all products from the API
    var products = fetchAllProducts(domain, token);

    var ss = SpreadsheetApp.getActive();
    var catalogSheet = ss.getSheetByName('Catalog');
    // Create the Catalog sheet if it doesn't exist
    if (!catalogSheet) {
      catalogSheet = ss.insertSheet('Catalog');
    } else {
      catalogSheet.clearContents();
    }

    // Define the columns we will write
    var headers = ['id', 'sku', 'name', 'type_id', 'price', 'status'];
    catalogSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Build the data rows
    var rows = [];
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      rows.push([
        p.id || '',
        p.sku || '',
        p.name || '',
        p.type_id || '',
        p.price || '',
        p.status || '',
      ]);
    }

    // Write rows to the Catalog sheet if there are any products
    if (rows.length > 0) {
      catalogSheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }

    // Create or update the "Simple" sheet with only simple products
    var simpleSheet = ss.getSheetByName('Simple');
    if (!simpleSheet) {
      simpleSheet = ss.insertSheet('Simple');
    } else {
      simpleSheet.clearContents();
    }
    // Write the same headers to the Simple sheet
    simpleSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    var simpleRows = [];
    for (var j = 0; j < products.length; j++) {
      var prod = products[j];
      if (prod.type_id && prod.type_id.toString().toLowerCase() === 'simple') {
        simpleRows.push([
          prod.id || '',
          prod.sku || '',
          prod.name || '',
          prod.type_id || '',
          prod.price || '',
          prod.status || '',
        ]);
      }
    }
    if (simpleRows.length > 0) {
      simpleSheet.getRange(2, 1, simpleRows.length, headers.length).setValues(simpleRows);
    }

    ui.alert(
      'Imported ' +
        products.length +
        ' products into the Catalog sheet. Simple products: ' +
        simpleRows.length +
        '.'
    );
  } catch (e) {
    ui.alert('Error importing products: ' + e.message);
    throw e;
  }
}