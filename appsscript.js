const SHEET_NAME = 'SalesData'; 

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const newRow = headers.map(header => {
      // auto-generate fields
      if (header === 'timestamp') return new Date();
      if (header === 'synced') return false; // Flag as unsynced
      if (header === 'order_id') return 'ORD-' + Utilities.getUuid().slice(0, 8).toUpperCase();
      if (header === 'total_amount') {
        const qty = parseFloat(e.parameter['quantity']) || 0;
        const price = parseFloat(e.parameter['unit_price']) || 0;
        return (qty * price).toFixed(2);
      }
      // other fields from the form
      return e.parameter[header] || '';
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', row: nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


function syncToBigQuery() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SalesData');
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return; 

  const headers = data[0];
  const syncedIndex = headers.indexOf('synced');
  let rowsToSync = [];
  let rowIndicesToMark = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][syncedIndex] === false || data[i][syncedIndex] === 'FALSE') {
            let row = data[i].slice(0, 12); 
      
      
      //trim all strings to remove invisible spaces
      row = row.map(cell => typeof cell === 'string' ? cell.trim() : cell);
      
      //format timestamp and date for BigQuery 
      row[0] = new Date(row[0]).toISOString(); 
      row[2] = new Date(row[2]).toISOString().split('T')[0]; 
      
      
      rowsToSync.push(row);



      rowIndicesToMark.push(i + 1); 
    }
  }

  if (rowsToSync.length === 0) return; 

  const projectId = 'news-8ec3e'; 
  const datasetId = 'sales_data';
  const tableId = 'transactions';

  try {
    let csvData = rowsToSync.map(row => row.join(',')).join('\n');
    const blob = Utilities.newBlob(csvData, 'text/csv');

    const job = {
      configuration: {
        load: {
          destinationTable: {
            projectId: projectId,
            datasetId: datasetId,
            tableId: tableId
          },
          sourceFormat: 'CSV',
          writeDisposition: 'WRITE_APPEND' // adds to the table, doesn't overwrite
        }
      }
    };

    BigQuery.Jobs.insert(job, projectId, blob);

    for (let i = 0; i < rowIndicesToMark.length; i++) {
      sheet.getRange(rowIndicesToMark[i], syncedIndex + 1).setValue(true);
    }
    console.log(`Successfully loaded ${rowsToSync.length} rows via Batch Job.`);

  } catch (e) {
    console.error("Error syncing to BigQuery: ", e);
  }
}