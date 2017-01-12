///////////////////////////////////////////////////////////////////////////////
// 合約位置 UI 功能

// 【清除合約位置】
var clearContractsAddress = function () {
  $("div.contracts_address").html('');
};

var appendContractsAddress = function (contract_name, contract_address) {
  if (typeof contract_name === 'undefined') {
    $("div.contracts_address").append('<hr>');
    return;
  }
  contract_address = typeof contract_address !== 'undefined' ? contract_address : 'N/A';

  $("div.contracts_address").append('<span style="width:200px; display:inline-block;">' + contract_name + '</span><span style="width:600px; display:inline-block;">' + contract_address + '</span>').append("<br>");
};

// 【加入一筆合約位置】
var addToContractsAddress = function (contract_name) {
  ContractsAddress.GetAddress(contract_name).then(function (contract_address) {
    if (contract_address != 0x0000000000000000000000000000000000000000) {
      appendContractsAddress(contract_name, contract_address);
    } else {
      appendContractsAddress(contract_name);
    }
  });
};

// 預設：合約清單
var contract_names = [
  'Person',
  'LegalEntity',
  'InternationInjuryAndDisease',
  'BankAccount',
  'Member',
  'Enrollment',
  'ContractTerm'
];

// 【重新載入合約位置】
var reloadContractsAddress = function () {
  clearContractsAddress();
  appendContractsAddress('contract_name', 'contract_address');
  appendContractsAddress();
  contract_names.forEach(function (contract_name) {
    addToContractsAddress(contract_name);
  });
};

var InitContractsAddress = function () {
  reloadContractsAddress();
  $("#set_contract_address button.set_contract_address").click(function () {
    addBoldToLog('[開始] 記錄合約位置');

    var contract_name = $("#set_contract_address .contract_name").val();
    var contract_address = $("#set_contract_address .contract_address").val();

    var start_date = moment();
    addMomentToLog(start_date);

    addCodeToLog('contract_name = ' + contract_name);
    addCodeToLog('contract_address = ' + contract_address);
    addCodeToLog("ContractsAddress.SetAddress(contract_name, contract_address);");
    addBarToLog();

    var e_SetAddress_listener = ContractsAddress._originalContractObject.e_SetAddress({
      contract_name: web3.sha3(contract_name)
    });
    e_SetAddress_listener.watch(function (err, logs) {
      if (!err) {
        addBoldToLog('[完成] 記錄合約位置');

        var end_date = moment();
        addMomentToLog(end_date);
        var diff_microseconds = end_date.diff(start_date);
        addToLog('time span: ' + diff_microseconds + ' ms');

        addJsonToLog(logs);
        addBarToLog();

        var existing_item_index = contract_names.findIndex(function (item_value) {
          return item_value == contract_name;
        });
        if (existing_item_index == -1) {
          contract_names.push(contract_name);
        }
        reloadContractsAddress();
      } else {
        addJsonToLog(err);
      }
      e_SetAddress_listener.stopWatching();
    });
    ContractsAddress.SetAddress(contract_name, contract_address);
  });
};
