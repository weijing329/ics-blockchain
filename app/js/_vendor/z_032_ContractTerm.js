///////////////////////////////////////////////////////////////////////////////
// 契約內容 UI 功能

// 【清除契約內容清單】
var clearContractTermList = function () {
  $("div.list_contract_term").html('');
};

var appendContractTermList = function (contract_term_CPK, contract_term_hash, claim_adjustment) {
  if (typeof contract_term_CPK === 'undefined') {
    $("div.list_contract_term").append('<hr>');
    return;
  }
  contract_term_hash = typeof contract_term_hash !== 'undefined' ? contract_term_hash : 'N/A';
  claim_adjustment = typeof claim_adjustment !== 'undefined' ? claim_adjustment : '';

  $("div.list_contract_term").append('<span style="width:200px; display:inline-block;">' + contract_term_CPK + '</span><span style="width:600px; display:inline-block;">' + contract_term_hash + '</span><span style="display:inline-block;">' + claim_adjustment + '</span>').append("<br>");
};

// 【加入一筆契約內容】
var addToContractTermList = function (contract_term_CPK) {
  InsuranceCompany.GetContractTerm(contract_term_CPK).then(function (contract_term_hash) {
    if (contract_term_hash != 0x0000000000000000000000000000000000000000) {
      InsuranceCompany.Get_claim_adjustment(contract_term_CPK).then(function (claim_adjustment) {
        appendContractTermList(contract_term_CPK, contract_term_hash, claim_adjustment);
      })
    } else {
      appendContractTermList(contract_term_CPK);
    }
  });
};

// 預設：契約內容清單
var contract_term_CPKs = [
  '1|1',
  '2|2'
];

// 【重新載入契約內容清單】
var reloadContractTermList = function () {
  clearContractTermList();
  appendContractTermList('composite_key', 'contract_term_hash', 'claim_adjustment : Decimal(19,9)x9');
  appendContractTermList();
  contract_term_CPKs.forEach(function (contract_term_CPK) {
    addToContractTermList(contract_term_CPK);
  });
};

var InitContractTerm = function () {
  reloadContractTermList();
  $("#set_contract_term button.set_contract_term").click(function () {
    addBoldToLog('[開始] 記錄契約內容');

    var composite_key = $("#set_contract_term .composite_key").val();
    var contract_term_hash = $("#set_contract_term .contract_term_hash").val();
    var claim_adjustment = $("#set_contract_term .claim_adjustment").val();

    var start_date = moment();
    addMomentToLog(start_date);

    addCodeToLog('composite_key = ' + composite_key);
    addCodeToLog('contract_term_hash = ' + contract_term_hash);
    addCodeToLog('claim_adjustment = ' + claim_adjustment);
    addCodeToLog("InsuranceCompany.SetContractTerm(composite_key, contract_term_hash, claim_adjustment);");
    addBarToLog();

    var e_SetContractTerm_listener = ContractTerm._originalContractObject.e_SetContractTerm({
      composite_key_hash: web3.sha3(composite_key)
    });
    e_SetContractTerm_listener.watch(function (err, logs) {
      if (!err) {
        addBoldToLog('[完成] 記錄契約內容');

        var end_date = moment();
        addMomentToLog(end_date);
        var diff_microseconds = end_date.diff(start_date);
        addToLog('time span: ' + diff_microseconds + ' ms');

        addJsonToLog(logs);
        addBarToLog();

        var existing_item_index = contract_term_CPKs.findIndex(function (item_value) {
          return item_value == composite_key;
        });
        if (existing_item_index == -1) {
          contract_term_CPKs.push(composite_key);
        }
        reloadContractTermList();
      } else {
        addJsonToLog(err);
      }
      e_SetContractTerm_listener.stopWatching();
    });

    InsuranceCompany.SetContractTerm(composite_key, contract_term_hash, claim_adjustment).then(function (txHash) {
      addBoldToLog('[Pending] 記錄契約內容');

      var pending_date = moment();
      addMomentToLog(pending_date);
      var diff_microseconds = pending_date.diff(start_date);
      addToLog('time span: ' + diff_microseconds + ' ms');

      addCodeToLog('txHash: ' + txHash);
      addBarToLog();
    });
  });
};
