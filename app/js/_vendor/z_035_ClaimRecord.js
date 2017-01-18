///////////////////////////////////////////////////////////////////////////////
// 寫入理賠案件 UI 功能

var ClaimRecordManager = (function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private

  var function_name = '寫入理賠案件';

  // Constructor
  function ClaimRecordManager() {}

  function Table() {
    return $("table.list_claim_record");
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
    html = html + '<th>insured_person_ID</th>';
    html = html + '<th>medical_record_ID</th>';
    html = html + '<th>eligible_benefit_amount</th>';
    html = html + '<th>claim_paid_TR_ID</th>';
    html = html + '<th>status_code</th>';
    html = html + '</tr>';

    Table().append(html);
    TableCreateTHEAD();
  }

  function AppendTableBody(index, composite_key, row_hash, insured_person_ID, medical_record_ID, eligible_benefit_amount, claim_paid_TR_ID, status_code) {
    row_hash = typeof row_hash !== 'undefined' ? row_hash : 'N/A';
    insured_person_ID = typeof insured_person_ID !== 'undefined' ? insured_person_ID : '';
    medical_record_ID = typeof medical_record_ID !== 'undefined' ? medical_record_ID : '';
    eligible_benefit_amount = typeof eligible_benefit_amount !== 'undefined' ? eligible_benefit_amount : '';
    claim_paid_TR_ID = typeof claim_paid_TR_ID !== 'undefined' ? claim_paid_TR_ID : '';
    status_code = typeof status_code !== 'undefined' ? status_code : '';

    //var row_count = Table().find("tr").length;
    var row_count = index + 1;

    var html = '<tr data-position="' + row_count + '">';
    html = html + '<th scope="row">' + row_count + '</th>';
    html = html + '<td>' + composite_key + '</td>';
    html = html + '<td style="word-wrap: break-word;min-width: 160px;max-width: 160px;">' + row_hash + '</td>';
    html = html + '<td>' + insured_person_ID + '</td>';
    html = html + '<td>' + medical_record_ID + '</td>';
    html = html + '<td>' + eligible_benefit_amount + '</td>';
    html = html + '<td>' + claim_paid_TR_ID + '</td>';
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

  var list_keys = [
    '1',
    '2',
    '3',
    '4'
  ];

  var addToList = function (composite_key, index) {
    InsuranceCompany.ClaimRecord_row_hash(composite_key).then(function (row_hash) {
      if (row_hash != 0x0000000000000000000000000000000000000000) {
        InsuranceCompany.ClaimRecord_insured_person_ID(composite_key).then(function (insured_person_ID) {
          InsuranceCompany.ClaimRecord_medical_record_ID(composite_key).then(function (medical_record_ID) {
            InsuranceCompany.ClaimRecord_eligible_benefit_amount(composite_key).then(function (eligible_benefit_amount) {
              InsuranceCompany.ClaimRecord_claim_paid_TR_ID(composite_key).then(function (claim_paid_TR_ID) {
                InsuranceCompany.ClaimRecord_status_code(composite_key).then(function (status_code) {
                  AppendTableBody(index, composite_key, row_hash, insured_person_ID, medical_record_ID, eligible_benefit_amount, claim_paid_TR_ID, status_code);
                })
              })
            })
          })
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
  ClaimRecordManager.prototype.Init = function () {
    // Init
    ReloadList();
    $("#set_claim_record button.set_claim_record").click(function () {
      addBoldToLog('[開始] ' + function_name);

      var composite_key = $("#set_claim_record .composite_key").val();
      var row_hash = $("#set_claim_record .row_hash").val();
      var insured_person_ID = $("#set_claim_record .insured_person_ID").val();
      var medical_record_ID = $("#set_claim_record .medical_record_ID").val();
      var eligible_benefit_amount = $("#set_claim_record .eligible_benefit_amount").val();
      var claim_paid_TR_ID = $("#set_claim_record .claim_paid_TR_ID").val();
      var status_code = $("#set_claim_record .status_code").val();

      var start_date = moment();
      addMomentToLog(start_date);

      addCodeToLog('composite_key = ' + composite_key);
      addCodeToLog('row_hash = ' + row_hash);
      addCodeToLog('insured_person_ID = ' + insured_person_ID);
      addCodeToLog('medical_record_ID = ' + medical_record_ID);
      addCodeToLog('eligible_benefit_amount = ' + eligible_benefit_amount);
      addCodeToLog('claim_paid_TR_ID = ' + claim_paid_TR_ID);
      addCodeToLog('status_code = ' + status_code);
      addCodeToLog("InsuranceCompany.SetClaimRecord(composite_key, row_hash, insured_person_ID, medical_record_ID, eligible_benefit_amount, claim_paid_TR_ID, status_code);");
      addBarToLog();

      var event_listener = ClaimRecord._originalContractObject.e_SetClaimRecord({
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

      InsuranceCompany.SetClaimRecord(composite_key, row_hash, insured_person_ID, medical_record_ID, eligible_benefit_amount, claim_paid_TR_ID, status_code, {gas: 300000}).then(function (txHash) {
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

  return ClaimRecordManager;
})();

var ClaimRecordManager = new ClaimRecordManager();