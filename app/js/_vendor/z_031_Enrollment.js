///////////////////////////////////////////////////////////////////////////////
// 註冊保戶保單 UI 功能

// 【清除註冊保戶保單清單】
var clearEnrollmentList = function () {
  $("div.list_enrollment").html('');
};

var appendEnrollmentList = function (enrollment_CPK, enrollment_hash, daily_benefit_amount) {
  if (typeof enrollment_CPK === 'undefined') {
    $("div.list_enrollment").append('<hr>');
    return;
  }
  enrollment_hash = typeof enrollment_hash !== 'undefined' ? enrollment_hash : 'N/A';
  daily_benefit_amount = typeof daily_benefit_amount !== 'undefined' ? daily_benefit_amount : '';

  $("div.list_enrollment").append('<span style="width:200px; display:inline-block;">' + enrollment_CPK + '</span><span style="width:600px; display:inline-block;">' + enrollment_hash + '</span><span style="display:inline-block;">' + daily_benefit_amount + '</span>').append("<br>");
};

// 【加入一筆註冊保戶保單】
var addToEnrollmentList = function (enrollment_CPK) {
  InsuranceCompany.GetEnrollment(enrollment_CPK).then(function (enrollment_hash) {
    if (enrollment_hash != 0x0000000000000000000000000000000000000000) {
      InsuranceCompany.Get_daily_benefit_amount(enrollment_CPK).then(function (daily_benefit_amount) {
        appendEnrollmentList(enrollment_CPK, enrollment_hash, daily_benefit_amount);
      })
    } else {
      appendEnrollmentList(enrollment_CPK);
    }
  });
};

// 預設：註冊保戶保單清單
var enrollment_CPKs = [
  '1|1|1',
  '2|2|2'
];

// 【重新載入註冊保戶保單清單】
var reloadEnrollmentList = function () {
  clearEnrollmentList();
  appendEnrollmentList('composite_key', 'enrollment_hash', 'daily_benefit_amount');
  appendEnrollmentList();
  enrollment_CPKs.forEach(function (enrollment_CPK) {
    addToEnrollmentList(enrollment_CPK);
  });
};

var InitEnrollment = function () {
  reloadEnrollmentList();
  $("#set_enrollment button.set_enrollment").click(function () {
    addBoldToLog('[開始] 註冊保戶保單');

    var composite_key = $("#set_enrollment .composite_key").val();
    var enrollment_hash = $("#set_enrollment .enrollment_hash").val();
    var daily_benefit_amount = $("#set_enrollment .daily_benefit_amount").val();

    var start_date = moment();
    addMomentToLog(start_date);

    addCodeToLog('composite_key = ' + composite_key);
    addCodeToLog('enrollment_hash = ' + enrollment_hash);
    addCodeToLog('daily_benefit_amount = ' + daily_benefit_amount);
    addCodeToLog("InsuranceCompany.SetEnrollment(composite_key, enrollment_hash, daily_benefit_amount);");
    addBarToLog();

    var e_SetEnrollment_listener = Enrollment._originalContractObject.e_SetEnrollment({
      composite_key_hash: web3.sha3(composite_key)
    });
    e_SetEnrollment_listener.watch(function (err, logs) {
      if (!err) {
        addBoldToLog('[完成] 註冊保戶保單');

        var end_date = moment();
        addMomentToLog(end_date);
        var diff_microseconds = end_date.diff(start_date);
        addToLog('time span: ' + diff_microseconds + ' ms');

        addJsonToLog(logs);
        addBarToLog();

        var existing_item_index = enrollment_CPKs.findIndex(function (item_value) {
          return item_value == composite_key;
        });
        if (existing_item_index == -1) {
          enrollment_CPKs.push(composite_key);
        }
        reloadEnrollmentList();
      } else {
        addJsonToLog(err);
      }
      e_SetEnrollment_listener.stopWatching();
    });

    InsuranceCompany.SetEnrollment(composite_key, enrollment_hash, daily_benefit_amount).then(function (txHash) {
      addBoldToLog('[Pending] 註冊保戶保單');

      var pending_date = moment();
      addMomentToLog(pending_date);
      var diff_microseconds = pending_date.diff(start_date);
      addToLog('time span: ' + diff_microseconds + ' ms');

      addCodeToLog('txHash: ' + txHash);
      addBarToLog();
    });
  });
};
