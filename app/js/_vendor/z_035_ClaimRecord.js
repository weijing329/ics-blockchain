///////////////////////////////////////////////////////////////////////////////
// 寫入理賠案件 UI 功能

var ClaimRecordManager = (function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private

  var function_name = '寫入理賠案件';
  var ContractObject = ClaimRecord._originalContractObject;
  var ContractObject_name = 'ClaimRecord';
  var div_ID = 'SetClaimRecord';
  var set_function = 'SetClaimRecord';
  var set_event = 'e_SetTableRowData';
  var function2 = 'CalculateBenefit';
  var function2_div_ID = 'CalculateBenefit';
  var function2_name = '計算理賠金額';
  var function2_event = 'e_SetStatusCode';

  // Constructor
  function ClaimRecordManager() {}

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
    html = html + '<th>row_CPK<br>理賠案件ID</th>';
    html = html + '<th>row_data</th>';
    html = html + '<th>insured_person_ID<br>被保險人ID</th>';
    html = html + '<th>medical_record_ID<br>醫療記錄ID</th>';
    html = html + '<th>eligible_benefit_amount : Decimal(19,4)x4<br>符合資格的給付保險金額</th>';
    html = html + '<th>status_code<br>理賠流程狀態碼</th>';
    html = html + '</tr>';

    Table().append(html);
    TableCreateTHEAD();
  }

  function AppendTableBody(index, row_CPK, row_data, insured_person_ID, medical_record_ID, eligible_benefit_amount, status_code) {
    row_data = typeof row_data !== 'undefined' ? row_data : 'N/A';
    insured_person_ID = typeof insured_person_ID !== 'undefined' ? insured_person_ID : '';
    medical_record_ID = typeof medical_record_ID !== 'undefined' ? medical_record_ID : '';
    eligible_benefit_amount = typeof eligible_benefit_amount !== 'undefined' ? eligible_benefit_amount : '';
    status_code = typeof status_code !== 'undefined' ? status_code : '';

    var html = '<tr data-position="' + index + '">';
    html = html + '<th scope="row">' + index + '</th>';
    html = html + '<td>' + row_CPK + '</td>';
    html = html + '<td style="word-wrap: break-word;min-width: 160px;max-width: 160px;">' + row_data + '</td>';
    html = html + '<td>' + insured_person_ID + '</td>';
    html = html + '<td>' + medical_record_ID + '</td>';
    html = html + '<td>' + eligible_benefit_amount + '</td>';
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
    var insured_person_ID = ContractObject.Get_insured_person_ID(row_CPK);
    var medical_record_ID = ContractObject.Get_medical_record_ID(row_CPK);
    var eligible_benefit_amount = ContractObject.Get_eligible_benefit_amount(row_CPK);
    var status_code = ContractObject.Get_status_code(row_CPK);

    AppendTableBody(index, row_CPK, row_data, insured_person_ID, medical_record_ID, eligible_benefit_amount, status_code);
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
  ClaimRecordManager.prototype.Init = function () {
    // Init
    ReloadList();
    $("#" + div_ID + " button." + set_function).click(function () {
      addBoldToLog('[開始] ' + function_name);

      var row_CPK = $("#" + div_ID + " .row_CPK").val();
      var row_data = $("#" + div_ID + " .row_data").val();
      var insured_person_ID = $("#" + div_ID + " .insured_person_ID").val();
      var medical_record_ID = $("#" + div_ID + " .medical_record_ID").val();
      var eligible_benefit_amount = $("#" + div_ID + " .eligible_benefit_amount").val();
      var status_code = $("#" + div_ID + " .status_code").val();

      var start_date = moment();
      addMomentToLog(start_date);

      addCodeToLog('row_CPK = ' + row_CPK);
      addCodeToLog('row_data = ' + row_data);
      addCodeToLog('insured_person_ID = ' + insured_person_ID);
      addCodeToLog('medical_record_ID = ' + medical_record_ID);
      addCodeToLog('eligible_benefit_amount = ' + eligible_benefit_amount);
      addCodeToLog('status_code = ' + status_code);
      addCodeToLog(ContractObject_name + "." + set_function + "(row_CPK, row_data, insured_person_ID, medical_record_ID, eligible_benefit_amount, status_code);");
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

      var txHash = ContractObject[set_function](row_CPK, row_data, insured_person_ID, medical_record_ID, eligible_benefit_amount, status_code, {gas: 4141592});
      addBoldToLog('[Pending] ' + function_name);

      var pending_date = moment();
      addMomentToLog(pending_date);
      var diff_microseconds = pending_date.diff(start_date);
      addToLog('time span: ' + diff_microseconds + ' ms');

      addCodeToLog('txHash: ' + txHash);
      addJsonToLog(web3.eth.getTransaction(txHash), 'Transaction');
      addBarToLog();

    });

    $("#" + function2_div_ID + " button." + function2).click(function () {
      addBoldToLog('[開始] ' + function2_name);

      var row_CPK = $("#" + function2_div_ID + " .row_CPK").val();
      var insurance_policy_package_ID = $("#" + function2_div_ID + " .insurance_policy_package_ID").val();
      var insurance_policy_ID = $("#" + function2_div_ID + " .insurance_policy_ID").val();
      var benefit_item_ID = $("#" + function2_div_ID + " .benefit_item_ID").val();

      var start_date = moment();
      addMomentToLog(start_date);

      addCodeToLog('row_CPK = ' + row_CPK);
      addCodeToLog('insurance_policy_package_ID = ' + insurance_policy_package_ID);
      addCodeToLog('insurance_policy_ID = ' + insurance_policy_ID);
      addCodeToLog('benefit_item_ID = ' + benefit_item_ID);
      addCodeToLog(ContractObject_name + "." + function2 + "(row_CPK, insurance_policy_package_ID, insurance_policy_ID, benefit_item_ID);");
      addBarToLog();

      var event_listener = ContractObject[function2_event]({
        row_CPK_hash: web3.sha3(row_CPK)
      });
      event_listener.watch(function (err, logs) {
        if (!err) {
          addBoldToLog('[完成] ' + function2_name);

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

      var txHash = ContractObject[function2](row_CPK, insurance_policy_package_ID, insurance_policy_ID, benefit_item_ID, {gas: 4141592});
      addBoldToLog('[Pending] ' + function2_name);

      var pending_date = moment();
      addMomentToLog(pending_date);
      var diff_microseconds = pending_date.diff(start_date);
      addToLog('time span: ' + diff_microseconds + ' ms');

      addCodeToLog('txHash: ' + txHash);
      addJsonToLog(web3.eth.getTransaction(txHash), 'Transaction');
      addBarToLog();

    });
  };

  return ClaimRecordManager;
})();

var ClaimRecordManager = new ClaimRecordManager();