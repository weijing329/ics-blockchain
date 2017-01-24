///////////////////////////////////////////////////////////////////////////////
// 寫入國際傷疾病代碼 UI 功能

var InternationInjuryAndDiseaseManager = (function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private

  var function_name = '寫入國際傷疾病代碼';
  var ContractObject = InternationInjuryAndDisease._originalContractObject;
  var ContractObject_name = 'InternationInjuryAndDisease';
  var div_ID = 'SetInternationInjuryAndDisease';
  var set_function = 'SetInternationInjuryAndDisease';
  var set_event = 'e_SetTableRowDataJson';

  // Constructor
  function InternationInjuryAndDiseaseManager() {}

  function Table() {
    return $("table.InternationInjuryAndDisease");
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
    html = html + '<th>row_CPK</th>';
    html = html + '<th>row_data_json</th>';
    html = html + '</tr>';

    Table().append(html);
    TableCreateTHEAD();
  }

  function AppendTableBody(index, row_CPK, row_data_json) {
    row_data_json = typeof row_data_json !== 'undefined' ? row_data_json : 'N/A';

    //var row_count = Table().find("tr").length;
    var row_count = index + 1;

    var html = '<tr data-position="' + row_count + '">';
    html = html + '<th scope="row">' + row_count + '</th>';
    html = html + '<td>' + row_CPK + '</td>';
    html = html + '<td style="word-wrap: break-word;min-width: 160px;max-width: 160px;">' + row_data_json + '</td>';
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

  // var list_keys = [
  //   'A1234',
  //   'B2345'
  // ];

  var addToList = function (row_CPK, index) {
    var row_data_json_hash = ContractObject.GetTableRowDataHash(row_CPK);
    var row_data_json = ContractObject.GetTableRowDataJson(row_CPK, row_data_json_hash);
    AppendTableBody(index, row_CPK, row_data_json);
  }

  function ReloadList() {
    ClearList();
    AppendTableHead();
    TableCreateTHEAD();
    // list_keys.forEach(function (row_CPK, index) {
    //   addToList(row_CPK, index);
    // });
    var row_count = ContractObject.GetRowCount().toNumber();
    for (var i = 0; i < row_count; i++) {
      var row_CPK = ContractObject.GetRowKey(i);
      addToList(row_CPK, i);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Public
  InternationInjuryAndDiseaseManager.prototype.Init = function () {
    // Init
    ReloadList();
    $("#" + div_ID + " button." + set_function).click(function () {
      addBoldToLog('[開始] ' + function_name);

      var row_CPK = $("#" + div_ID + " .row_CPK").val();
      var row_data_json = $("#" + div_ID + " .row_data_json").val();

      var start_date = moment();
      addMomentToLog(start_date);

      addCodeToLog('row_CPK = ' + row_CPK);
      addCodeToLog('row_data_json = ' + row_data_json);
      addCodeToLog(ContractObject_name + "." + set_function + "(row_CPK, row_data_json, {gas: 4141592});");
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

          // var existing_item_index = list_keys.findIndex(function (item_value) {
          //   return item_value == row_CPK;
          // });
          // if (existing_item_index == -1) {
          //   list_keys.push(row_CPK);
          // }
          ReloadList();
        } else {
          addJsonToLog(err);
        }
        event_listener.stopWatching();
      });

      var txHash = ContractObject[set_function](row_CPK, row_data_json, {gas: 4141592});
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

  return InternationInjuryAndDiseaseManager;
})();

var InternationInjuryAndDiseaseManager = new InternationInjuryAndDiseaseManager();