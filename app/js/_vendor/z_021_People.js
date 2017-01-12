///////////////////////////////////////////////////////////////////////////////
// 自然人 UI 功能

// 【清除自然人清單】
var clearPeopleList = function () {
  $("div.list_people").html('');
};

var appendPeopleList = function (person_code, person_hash) {
  if (typeof person_code === 'undefined') {
    $("div.list_people").append('<hr>');
    return;
  }
  person_hash = typeof person_hash !== 'undefined' ? person_hash : 'N/A';

  $("div.list_people").append('<span style="width:200px; display:inline-block;">' + person_code + '</span><span style="width:600px; display:inline-block;">' + person_hash + '</span>').append("<br>");
};

// 【加入一筆自然人】
var addToPeopleList = function (person_code) {
  Government.GetPerson(person_code).then(function (person_hash) {
    if (person_hash != 0x0000000000000000000000000000000000000000) {
      appendPeopleList(person_code, person_hash);
    } else {
      appendPeopleList(person_code);
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
  appendPeopleList('person_code', 'person_hash');
  appendPeopleList();
  person_codes.forEach(function (person_code) {
    addToPeopleList(person_code);
  });
};

var InitPerson = function () {
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
};
