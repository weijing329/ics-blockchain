///////////////////////////////////////////////////////////////////////////////
// 註冊保戶保單 UI 功能

var EnrollmentManager = (function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private

  var function_name = '註冊保戶保單';

  // Constructor
  function EnrollmentManager() {}

  function Table() {
    return $("table.list_enrollment");
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

  function AppendTableHead(enrollment_CPK, enrollment_hash, daily_benefit_amount, policy_claimable_amount) {
    var html = '<tr>';
    html = html + '<th>#</th>';
    html = html + '<th>' + enrollment_CPK + '</th>';
    html = html + '<th>' + enrollment_hash + '</th>';
    html = html + '<th>' + daily_benefit_amount + '</th>';
    html = html + '<th>' + policy_claimable_amount + '</th>';
    html = html + '</tr>';

    Table().append(html);
  }

  function AppendTableBody(enrollment_CPK, enrollment_hash, daily_benefit_amount, policy_claimable_amount) {
    enrollment_hash = typeof enrollment_hash !== 'undefined' ? enrollment_hash : 'N/A';
    daily_benefit_amount = typeof daily_benefit_amount !== 'undefined' ? daily_benefit_amount : '';
    policy_claimable_amount = typeof policy_claimable_amount !== 'undefined' ? policy_claimable_amount : '';

    var row_count = Table().find("tr").length;

    var html = '<tr>';
    html = html + '<th scope="row">' + row_count + '</th>';
    html = html + '<td>' + enrollment_CPK + '</td>';
    html = html + '<td style="word-wrap: break-word;min-width: 160px;max-width: 160px;">' + enrollment_hash + '</td>';
    html = html + '<td>' + daily_benefit_amount + '</td>';
    html = html + '<td>' + policy_claimable_amount + '</td>';
    html = html + '</tr>';

    var table = Table();
    var tbody = table.find("tbody");

    if (tbody.length===0){  //if there is no thead element, add one.
      tbody = $("<tbody></tbody>").appendTo(table);    
    }

    $(html).appendTo(tbody);
  };

  var list_keys = [
    '1|1|1',
    '2|2|2'
  ];

  var addToList = function (enrollment_CPK) {
    InsuranceCompany.GetEnrollment(enrollment_CPK).then(function (enrollment_hash) {
      if (enrollment_hash != 0x0000000000000000000000000000000000000000) {
        InsuranceCompany.Get_daily_benefit_amount(enrollment_CPK).then(function (daily_benefit_amount) {
          InsuranceCompany.Get_policy_claimable_amount(enrollment_CPK).then(function (policy_claimable_amount) {
            AppendTableBody(enrollment_CPK, enrollment_hash, daily_benefit_amount, policy_claimable_amount);
          })
        })
      } else {
        AppendTableBody(enrollment_CPK);
      }
    });
  };

  function ReloadList() {
    ClearList();
    AppendTableHead('enrollment_CPK', 'enrollment_hash', 'daily_benefit_amount : Int', 'policy_claimable_amount: Int');
    TableCreateTHEAD();
    list_keys.forEach(function (enrollment_CPK) {
      addToList(enrollment_CPK);
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Public

  EnrollmentManager.prototype.Init = function () {
    // Init
    ReloadList();
    $("#set_enrollment button.set_enrollment").click(function () {
      addBoldToLog('[開始] ' + function_name);

      var composite_key = $("#set_enrollment .composite_key").val();
      var enrollment_hash = $("#set_enrollment .enrollment_hash").val();
      var daily_benefit_amount = $("#set_enrollment .daily_benefit_amount").val();
      var policy_claimable_amount = $("#set_enrollment .policy_claimable_amount").val();

      var start_date = moment();
      addMomentToLog(start_date);

      addCodeToLog('composite_key = ' + composite_key);
      addCodeToLog('enrollment_hash = ' + enrollment_hash);
      addCodeToLog('daily_benefit_amount = ' + daily_benefit_amount);
      addCodeToLog('policy_claimable_amount = ' + policy_claimable_amount);
      addCodeToLog("InsuranceCompany.SetEnrollment(composite_key, enrollment_hash, daily_benefit_amount, policy_claimable_amount);");
      addBarToLog();

      var event_listener = Enrollment._originalContractObject.e_SetEnrollment({
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

      InsuranceCompany.SetEnrollment(composite_key, enrollment_hash, daily_benefit_amount, policy_claimable_amount).then(function (txHash) {
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

  return EnrollmentManager;
})();

var EnrollmentManager = new EnrollmentManager();