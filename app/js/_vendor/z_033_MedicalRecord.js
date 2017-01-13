///////////////////////////////////////////////////////////////////////////////
// 記錄醫療記錄 UI 功能

var MedicalRecordManager = (function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private

  var function_name = '寫入醫療記錄';

  // Constructor
  function MedicalRecordManager() {}

  function List() {
    return $("div.list_medical_record");
  };

  function ClearList() {
    List().html('');
  };

  function AppendList(medical_record_ID, medical_record_hash, hospital_days, fee) {
    if (typeof medical_record_ID === 'undefined') {
      List().append('<hr>');
      return;
    }
    medical_record_hash = typeof medical_record_hash !== 'undefined' ? medical_record_hash : 'N/A';
    hospital_days = typeof hospital_days !== 'undefined' ? hospital_days : '';
    fee = typeof fee !== 'undefined' ? fee : '';

    var html = '<span style="width:200px; display:inline-block;">' + medical_record_ID + '</span>';
    html = html + '<span style="width:600px; display:inline-block;">' + medical_record_hash + '</span>';
    html = html + '<span style="width:200px; display:inline-block;">' + hospital_days + '</span>';
    html = html + '<span style="width:200px; display:inline-block;">' + fee + '</span>';

    List().append(html).append("<br>");
  };

  var list_keys = [
    1,
    2
  ];

  var addToList = function (medical_record_ID) {
    InsuranceCompany.GetMedicalRecord(medical_record_ID).then(function (medical_record_hash) {
      if (medical_record_hash != 0x0000000000000000000000000000000000000000) {
        InsuranceCompany.Get_hospital_days(medical_record_ID).then(function (hospital_days) {
          InsuranceCompany.Get_fee(medical_record_ID).then(function (fee) {
            AppendList(medical_record_ID, medical_record_hash, hospital_days, fee);
          })
        })
      } else {
        AppendList(medical_record_ID);
      }
    });
  };

  function ReloadList() {
    ClearList();
    AppendList('medical_record_ID', 'medical_record_hash', 'hospital_days : Int', 'fee: Int');
    AppendList();
    list_keys.forEach(function (medical_record_ID) {
      addToList(medical_record_ID);
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Public

  MedicalRecordManager.prototype.Init = function () {
    // Init
    ReloadList();
    $("#set_medical_record button.set_medical_record").click(function () {
      addBoldToLog('[開始] ' + function_name);

      var medical_record_ID = $("#set_medical_record .medical_record_ID").val();
      var medical_record_hash = $("#set_medical_record .medical_record_hash").val();
      var hospital_days = $("#set_medical_record .hospital_days").val();
      var fee = $("#set_medical_record .fee").val();

      var start_date = moment();
      addMomentToLog(start_date);

      addCodeToLog('medical_record_ID = ' + medical_record_ID);
      addCodeToLog('medical_record_hash = ' + medical_record_hash);
      addCodeToLog('hospital_days = ' + hospital_days);
      addCodeToLog('fee = ' + fee);
      addCodeToLog("InsuranceCompany.SetMedicalRecord(medical_record_ID, medical_record_hash, hospital_days, fee);");
      addBarToLog();

      var event_listener = MedicalRecord._originalContractObject.e_SetMedicalRecord({
        medical_record_ID: medical_record_ID
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
            return item_value == medical_record_ID;
          });
          if (existing_item_index == -1) {
            list_keys.push(medical_record_ID);
          }
          ReloadList();
        } else {
          addJsonToLog(err);
        }
        event_listener.stopWatching();
      });

      InsuranceCompany.SetMedicalRecord(medical_record_ID, medical_record_hash, hospital_days, fee).then(function (txHash) {
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

  return MedicalRecordManager;
})();

var MedicalRecordManager = new MedicalRecordManager();