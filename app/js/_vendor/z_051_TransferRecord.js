///////////////////////////////////////////////////////////////////////////////
// 寫入理賠案件 UI 功能

var TransferRecordManager = (function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private

  var function_name = '寫入轉帳記錄';
  var ContractObject = TransferRecord._originalContractObject;
  var ContractObject_name = 'TransferRecord';
  var div_ID = 'SetTransferRecord';
  var set_function = 'SetTransferRecord';
  var set_event = 'e_SetTableRowData';

  // Constructor
  function TransferRecordManager() {}

  function Table() {
    return $("table." + ContractObject_name);
  };

  function ClearList() {
    Table().html('');
  };

  function TableCreateTHEAD() {
    var table = Table();
    var thead = table.find("thead");
    var thRows =  table.find("tr:has(th)");

    if (thead.length===0){  //if there is no thead element, add one.
      thead = $("<thead></thead>").appendTo(table);    
    }

    var copy = thRows.clone(true).appendTo(thead);
    thRows.remove();
  }

  function AppendTableHead() {
    var html = '<tr>';
    html = html + '<th>#</th>';
    html = html + '<th>row_CPK<br>轉帳記錄ID</th>';
    html = html + '<th>row_data</th>';
    html = html + '<th>transfer_amount : Decimal(19,4)x4<br>轉賬金額</th>';
    html = html + '<th>status_code<br>轉帳流程狀態碼</th>';
    html = html + '</tr>';

    Table().append(html);
    TableCreateTHEAD();
  }

  function AppendTableBody(index, row_CPK, row_data, transfer_amount, status_code) {
    row_data = typeof row_data !== 'undefined' ? row_data : 'N/A';
    transfer_amount = typeof transfer_amount !== 'undefined' ? transfer_amount : '';
    status_code = typeof status_code !== 'undefined' ? status_code : '';

    var html = '<tr data-position="' + index + '">';
    html = html + '<th scope="row">' + index + '</th>';
    html = html + '<td>' + row_CPK + '</td>';
    html = html + '<td style="word-wrap: break-word;min-width: 160px;max-width: 160px;">' + syntaxHighlight(row_data) + '</td>';
    html = html + '<td>' + transfer_amount + '</td>';
    html = html + '<td>' + status_code + '</td>';
    html = html + '</tr>';

    var table = Table();
    var tbody = table.find("tbody");

    if (tbody.length===0){  //if there is no thead element, add one.
      tbody = $("<tbody></tbody>").appendTo(table);    
    }

    $(html).appendTo(tbody);
    SortTableBody();
  };

  function SortTableBody() {
    var table = Table();
    var tbody = table.find("tbody");
    var tr_sorted = tbody.find("tr").sort(sort_tr_data_position);
    tbody.find("tr").remove();
    tr_sorted.appendTo(tbody);
  }

  function sort_tr_data_position(a, b){
    return ($(b).data('position')) < ($(a).data('position')) ? 1 : -1;    
  }

  function SortTableBody() {
    var table = Table();
    var tbody = table.find("tbody");
    var tr_sorted = tbody.find("tr").sort(sort_tr_data_position);
    tbody.find("tr").remove();
    tr_sorted.appendTo(tbody);
  }

  function sort_tr_data_position(a, b){
    return ($(b).data('position')) < ($(a).data('position')) ? 1 : -1;    
  }

  var addToList = function (row_CPK, index) {
    var row_data_hash = ContractObject.GetTableRowDataHash(row_CPK);
    var row_data = ContractObject.GetTableRowData(row_CPK, row_data_hash);
    var transfer_amount = ContractObject.Get_transfer_amount(row_CPK);
    var status_code = ContractObject.Get_status_code(row_CPK);

    AppendTableBody(index, row_CPK, row_data, transfer_amount, status_code);
  }

  function ReloadList() {
    ClearList();
    AppendTableHead();
    TableCreateTHEAD();
    var row_count = ContractObject.GetRowCount().toNumber();
    for (var i = 0; i < row_count; i++) {
      var row_CPK = ContractObject.GetRowKey(i);
      addToList(row_CPK, i);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Public
  TransferRecordManager.prototype.Init = function () {
    // Init
    ReloadList();
    $("#" + div_ID + " button." + set_function).click(function () {
      addBoldToLog('[開始] ' + function_name);

      var row_CPK = $("#" + div_ID + " .row_CPK").val();
      var row_data = $("#" + div_ID + " .row_data").val();
      var transfer_amount = $("#" + div_ID + " .transfer_amount").val();
      var status_code = $("#" + div_ID + " .status_code").val();

      var start_date = moment();
      addMomentToLog(start_date);

      addCodeToLog('row_CPK = ' + row_CPK);
      addCodeToLog('row_data = ' + row_data);
      addCodeToLog('transfer_amount = ' + transfer_amount);
      addCodeToLog('status_code = ' + status_code);
      addCodeToLog(ContractObject_name + "." + set_function + "(row_CPK, row_data, transfer_amount, status_code);");
      addBarToLog();

      var event_listener = ContractObject[set_event]({
        row_CPK_hash: web3.sha3(row_CPK)
      });
      event_listener.watch(function (err, logs) {
        if (!err) {
          addBoldToLog('[完成] ' + function_name);

          var end_date = moment();
          addMomentToLog(end_date);
          var diff_microseconds = end_date.diff(start_date);
          addToLog('time span: ' + diff_microseconds + ' ms');

          addJsonToLog(logs, 'logs');

          var txHash = logs.transactionHash;
          addJsonToLog(web3.eth.getTransactionReceipt(txHash), 'TransactionReceipt');

          addBarToLog();

          ReloadList();
        } else {
          addJsonToLog(err);
        }
        event_listener.stopWatching();
      });

      var txHash = ContractObject[set_function](row_CPK, row_data, transfer_amount, status_code, {gas: 4141592});
      addBoldToLog('[Pending] ' + function_name);

      var pending_date = moment();
      addMomentToLog(pending_date);
      var diff_microseconds = pending_date.diff(start_date);
      addToLog('time span: ' + diff_microseconds + ' ms');

      addCodeToLog('txHash: ' + txHash);
      addJsonToLog(web3.eth.getTransaction(txHash), 'Transaction');
      addBarToLog();

    });

  };

  return TransferRecordManager;
})();

var TransferRecordManager = new TransferRecordManager();