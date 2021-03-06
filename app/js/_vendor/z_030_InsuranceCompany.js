///////////////////////////////////////////////////////////////////////////////
// 政府共用資料 UI 功能

var InsuranceCompanyContractsManager = (function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private functions

  // Constructor
  function InsuranceCompanyContractsManager() {}

  function List() {
    return $("div.list_insurance_company_contracts");
  };

  // 【清除合約位置清單】
  function ClearList() {
    List().html('');
  };

  function AppendList(contract_name, contract_address) {
    if (typeof contract_name === 'undefined') {
      List().append('<hr>');
      return;
    }
    contract_address = typeof contract_address !== 'undefined' ? contract_address : 'N/A';

    List().append('<span style="width:200px; display:inline-block;">' + contract_name + '</span><span style="width:600px; display:inline-block;">' + contract_address + '</span>').append("<br>");
  };

  // 【重新載入契約內容清單】
  function ReloadList() {
    ClearList();
    AppendList('contract_name', 'contract_address');
    AppendList();
    AppendList('ContractsAddress', InsuranceCompany._originalContractObject.h_ContractsAddress());
    AppendList('Enrollment', InsuranceCompany._originalContractObject.h_Enrollment());
    AppendList('ContractTerm', InsuranceCompany._originalContractObject.h_ContractTerm());
    AppendList('MedicalRecord', InsuranceCompany._originalContractObject.h_MedicalRecord());
    AppendList('InsurancePolicy', InsuranceCompany._originalContractObject.h_InsurancePolicy());
    AppendList('ClaimRecord', InsuranceCompany._originalContractObject.h_ClaimRecord());
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Public functions

  InsuranceCompanyContractsManager.prototype.Init = function () {
    // Init
    ReloadList();
    // $("#set_contract_term button.set_contract_term").click(function () {
    //   addBoldToLog('[開始] 記錄契約內容');

    //   var composite_key = $("#set_contract_term .composite_key").val();
    //   var contract_term_hash = $("#set_contract_term .contract_term_hash").val();
    //   var claim_adjustment = $("#set_contract_term .claim_adjustment").val();

    //   var start_date = moment();
    //   addMomentToLog(start_date);

    //   addCodeToLog('composite_key = ' + composite_key);
    //   addCodeToLog('contract_term_hash = ' + contract_term_hash);
    //   addCodeToLog('claim_adjustment = ' + claim_adjustment);
    //   addCodeToLog("InsuranceCompany.SetContractTerm(composite_key, contract_term_hash, claim_adjustment);");
    //   addBarToLog();

    //   var e_SetContractTerm_listener = ContractTerm._originalContractObject.e_SetContractTerm({
    //     composite_key_hash: web3.sha3(composite_key)
    //   });
    //   e_SetContractTerm_listener.watch(function (err, logs) {
    //     if (!err) {
    //       addBoldToLog('[完成] 記錄契約內容');

    //       var end_date = moment();
    //       addMomentToLog(end_date);
    //       var diff_microseconds = end_date.diff(start_date);
    //       addToLog('time span: ' + diff_microseconds + ' ms');

    //       addJsonToLog(logs);
    //       addBarToLog();

    //       var existing_item_index = contract_names.findIndex(function (item_value) {
    //         return item_value == composite_key;
    //       });
    //       if (existing_item_index == -1) {
    //         contract_names.push(composite_key);
    //       }
    //       reloadContractTermList();
    //     } else {
    //       addJsonToLog(err);
    //     }
    //     e_SetContractTerm_listener.stopWatching();
    //   });

    //   InsuranceCompany.SetContractTerm(composite_key, contract_term_hash, claim_adjustment).then(function (txHash) {
    //     addBoldToLog('[Pending] 記錄契約內容');

    //     var pending_date = moment();
    //     addMomentToLog(pending_date);
    //     var diff_microseconds = pending_date.diff(start_date);
    //     addToLog('time span: ' + diff_microseconds + ' ms');

    //     addCodeToLog('txHash: ' + txHash);
    //     addBarToLog();
    //   });
    // });
  };

  return InsuranceCompanyContractsManager;
})();

var InsuranceCompanyContractsManager = new InsuranceCompanyContractsManager();