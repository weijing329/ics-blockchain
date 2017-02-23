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
  'ConcateCPK',
  'Person',
  'InternationInjuryAndDisease',
  'Enrollment',
  'ContractTerm',
  'MedicalRecord',
  'InsurancePolicy',
  'ClaimRecord',
  'TransferRecord'
];

// 【重新載入合約位置】
var reloadContractsAddress = function () {
  clearContractsAddress();
  appendContractsAddress('contract_name', 'contract_address');
  appendContractsAddress();
  appendContractsAddress('ContractsAddress', ContractsAddress.address);
  appendContractsAddress();
  contract_names.forEach(function (contract_name) {
    addToContractsAddress(contract_name);
  });
};

var InitContractsAddress = function () {
  reloadContractsAddress();
  
  $("#set_contract_address button.set_contract_address").click(function () {
    contract_names.forEach(function (contract_name) {
      ContractsAddress.SetAddress(contract_name, window[contract_name].address);
    });
    reloadContractsAddress();
  });
};