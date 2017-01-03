var syntaxHighlight = function (json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
};

var addCodeToLog = function (code) {
  var pre = document.createElement('pre');
  pre.innerHTML = code;
  $(".logs").append(pre);
};

var addJsonToLog = function (input) {
  if (typeof input === 'object') {
    var pretty_json = JSON.stringify(input, undefined, 2);
    addCodeToLog(syntaxHighlight(pretty_json));
  } else {
    addCodeToLog(input);
  }
};

var addToLog = function (txt) {
  $(".logs").append("<br>").append(txt);
};

var addBoldToLog = function (txt) {
  addToLog('<b>' + txt + '</b>');
};

var addMomentToLog = function (moment) {
  addBoldToLog(moment.format('YYYY-MM-DD HH:mm:ss.SSS Z'));
};

var addBarToLog = function () {
  $(".logs").append("<hr>");
};

///////////////////////////////////////////////////////////////////////////////
// 合約位置

// 【清除合約位置】
var clearContractsAddress = function () {
  $("div.contracts_address").html('');
};

// 【加入一筆合約位置】
var addToContractsAddress = function (contract_name) {
  ContractsAddress.GetAddress(contract_name).then(function (contract_address) {
    if (contract_address != 0x0000000000000000000000000000000000000000) {
      $("div.contracts_address").append('<span style="width:200px; display:inline-block;">' + contract_name + '</span>' + contract_address).append("<br>");
    } else {
      $("div.contracts_address").append('<span style="width:200px; display:inline-block;">' + contract_name + '</span>N/A').append("<br>");
    }
  });
};

// 預設：合約清單
var contract_names = [
  'Person',
  'LegalEntity',
  'InternationInjuryAndDisease',
  'BankAccount',
  'Member'
];

// 【重新載入合約位置】
var reloadContractsAddress = function () {
  clearContractsAddress();
  contract_names.forEach(function (contract_name) {
    addToContractsAddress(contract_name);
  });
};

///////////////////////////////////////////////////////////////////////////////
// 自然人

// 【清除自然人清單】
var clearPeopleList = function () {
  $("div.list_people").html('');
};

// 【加入一筆自然人】
var addToPeopleList = function (person_code) {
  Government.GetPerson(person_code).then(function (person_hash) {
    if (person_hash != 0x0000000000000000000000000000000000000000) {
      $("div.list_people").append('<span style="width:200px; display:inline-block;">' + person_code + '</span>' + person_hash).append("<br>");
    } else {
      $("div.list_people").append('<span style="width:200px; display:inline-block;">' + person_code + '</span>N/A').append("<br>");
    }
  });
};

// 預設：自然人清單
var person_codes = [
  'A123456789',
  'B234567890'
];

// 【重新載入自然人清單】
var reloadPeopleList = function () {
  clearPeopleList();
  person_codes.forEach(function (person_code) {
    addToPeopleList(person_code);
  });
};

///////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {

  // 【記錄合約位置】
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

  // 【記錄自然人】
  reloadPeopleList();
  $("#set_person button.set_person").click(function () {
    addBoldToLog('[開始] 記錄自然人');

    var person_code = $("#set_person .person_code").val();
    var person_hash = $("#set_person .person_hash").val();

    var start_date = moment();
    addMomentToLog(start_date);

    addCodeToLog('person_code = ' + person_code);
    addCodeToLog('person_hash = ' + person_hash);
    addCodeToLog("Government.SetPerson(person_code, person_hash);");
    addBarToLog();

    var e_SetPerson_listener = Person._originalContractObject.e_SetPerson({
      person_code_hash: web3.sha3(person_code)
    });
    e_SetPerson_listener.watch(function (err, logs) {
      if (!err) {
        addBoldToLog('[完成] 記錄自然人');

        var end_date = moment();
        addMomentToLog(end_date);
        var diff_microseconds = end_date.diff(start_date);
        addToLog('time span: ' + diff_microseconds + ' ms');

        addJsonToLog(logs);
        addBarToLog();

        var existing_item_index = person_codes.findIndex(function (item_value) {
          return item_value == person_code;
        });
        if (existing_item_index == -1) {
          person_codes.push(person_code);
        }
        reloadPeopleList();
      } else {
        addJsonToLog(err);
      }
      e_SetPerson_listener.stopWatching();
    });

    Government.SetPerson(person_code, person_hash).then(function (txHash) {
      addBoldToLog('[Pending] 記錄自然人');

      var pending_date = moment();
      addMomentToLog(pending_date);
      var diff_microseconds = pending_date.diff(start_date);
      addToLog('time span: ' + diff_microseconds + ' ms');

      addCodeToLog('txHash: ' + txHash);
      addBarToLog();
    });
  });


});