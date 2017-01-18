///////////////////////////////////////////////////////////////////////////////
// 寫入保險契約 UI 功能

var InsurancePolicyManager = (function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private

  var function_name = '寫入保險契約';

  // Constructor
  function InsurancePolicyManager() {}

  function Table() {
    return $("table.list_insurance_policy");
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
    html = html + '<th>composite_key</th>';
    html = html + '<th>row_hash</th>';
    html = html + '<th>contract_address</th>';
    html = html + '</tr>';

    Table().append(html);
    TableCreateTHEAD();
  }

  function AppendTableBody(index, composite_key, row_hash, contract_address) {
    row_hash = typeof row_hash !== 'undefined' ? row_hash : 'N/A';
    contract_address = typeof contract_address !== 'undefined' ? contract_address : '';

    //var row_count = Table().find("tr").length;
    var row_count = index + 1;

    var html = '<tr data-position="' + row_count + '">';
    html = html + '<th scope="row">' + row_count + '</th>';
    html = html + '<td>' + composite_key + '</td>';
    html = html + '<td style="word-wrap: break-word;min-width: 160px;max-width: 160px;">' + row_hash + '</td>';
    html = html + '<td>' + contract_address + '</td>';
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

  var list_keys = [
    '1',
    '2',
    '3',
    '4'
  ];

  var addToList = function (composite_key, index) {
    InsuranceCompany.InsurancePolicy_row_hash(composite_key).then(function (row_hash) {
      if (row_hash != 0x0000000000000000000000000000000000000000) {
        InsuranceCompany.InsurancePolicy_contract_address(composite_key).then(function (contract_address) {
          AppendTableBody(index, composite_key, row_hash, contract_address);
        })
      } else {
        AppendTableBody(index, composite_key);
      }
    });
  };

  function ReloadList() {
    ClearList();
    AppendTableHead();
    TableCreateTHEAD();
    list_keys.forEach(function (composite_key, index) {
      addToList(composite_key, index);
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Public
  InsurancePolicyManager.prototype.Init = function () {
    // Init
    ReloadList();
    $("#set_insurance_policy button.set_insurance_policy").click(function () {
      addBoldToLog('[開始] ' + function_name);

      var composite_key = $("#set_insurance_policy .composite_key").val();
      var row_hash = $("#set_insurance_policy .row_hash").val();
      var contract_address = $("#set_insurance_policy .contract_address").val();

      var start_date = moment();
      addMomentToLog(start_date);

      addCodeToLog('composite_key = ' + composite_key);
      addCodeToLog('row_hash = ' + row_hash);
      addCodeToLog('contract_address = ' + contract_address);
      addCodeToLog("InsuranceCompany.SetInsurancePolicy(composite_key, row_hash, contract_address);");
      addBarToLog();

      var event_listener = InsurancePolicy._originalContractObject.e_SetInsurancePolicy({
        composite_key_hash: web3.sha3(composite_key)
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

          var existing_item_index = list_keys.findIndex(function (item_value) {
            return item_value == composite_key;
          });
          if (existing_item_index == -1) {
            list_keys.push(composite_key);
          }
          ReloadList();
        } else {
          addJsonToLog(err);
        }
        event_listener.stopWatching();
      });

      InsuranceCompany.SetInsurancePolicy(composite_key, row_hash, contract_address).then(function (txHash) {
        addBoldToLog('[Pending] ' + function_name);

        var pending_date = moment();
        addMomentToLog(pending_date);
        var diff_microseconds = pending_date.diff(start_date);
        addToLog('time span: ' + diff_microseconds + ' ms');

        addCodeToLog('txHash: ' + txHash);
        addJsonToLog(web3.eth.getTransaction(txHash), 'Transaction');
        addBarToLog();
      });
    });
  };

  return InsurancePolicyManager;
})();

var InsurancePolicyManager = new InsurancePolicyManager();