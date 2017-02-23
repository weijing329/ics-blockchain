///////////////////////////////////////////////////////////////////////////////
// 條款內容 UI 功能

var ContractTermManager = (function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private

  var function_name = '寫入條款內容';
  var ContractObject = ContractTerm._originalContractObject;
  var ContractObject_name = 'ContractTerm';
  var div_ID = 'SetContractTerm';
  var set_function = 'SetContractTerm';
  var set_event = 'e_SetTableRowData';

  // Constructor
  function ContractTermManager() {}

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
    html = html + '<th>row_CPK<br>保險條款ID | 手術給付項目ID</th>';
    html = html + '<th>row_data</th>';
    html = html + '<th>claim_adjustment : Decimal(19,9)x9<br>手術保險金倍率</th>';
    html = html + '</tr>';

    Table().append(html);
    TableCreateTHEAD();
  }

  function AppendTableBody(index, row_CPK, row_data, claim_adjustment) {
    row_data = typeof row_data !== 'undefined' ? row_data : 'N/A';
    claim_adjustment = typeof claim_adjustment !== 'undefined' ? claim_adjustment : '';

    var html = '<tr data-position="' + index + '">';
    html = html + '<th scope="row">' + index + '</th>';
    html = html + '<td>' + row_CPK + '</td>';
    html = html + '<td style="word-wrap: break-word;min-width: 160px;max-width: 160px;">' + syntaxHighlight(row_data) + '</td>';
    html = html + '<td>' + claim_adjustment + '</td>';
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

  var addToList = function (row_CPK, index) {
    var row_data_hash = ContractObject.GetTableRowDataHash(row_CPK);
    var row_data = ContractObject.GetTableRowData(row_CPK, row_data_hash);
    var claim_adjustment = ContractObject.Get_claim_adjustment(row_CPK);

    AppendTableBody(index, row_CPK, row_data, claim_adjustment);
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

  ContractTermManager.prototype.Init = function () {
    // Init
    ReloadList();
    $("#" + div_ID + " button." + set_function).click(function () {
      addBoldToLog('[開始] ' + function_name);

      var row_CPK = $("#" + div_ID + " .row_CPK").val();
      var row_data = $("#" + div_ID + " .row_data").val();
      var claim_adjustment = $("#" + div_ID + " .claim_adjustment").val();

      var start_date = moment();
      addMomentToLog(start_date);

      addCodeToLog('row_CPK = ' + row_CPK);
      addCodeToLog('row_data = ' + row_data);
      addCodeToLog('claim_adjustment = ' + claim_adjustment);
      addCodeToLog(ContractObject_name + "." + set_function + "(row_CPK, row_data, claim_adjustment);");
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

      var txHash = ContractObject[set_function](row_CPK, row_data, claim_adjustment, {gas: 4141592});
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

  return ContractTermManager;
})();

var ContractTermManager = new ContractTermManager();