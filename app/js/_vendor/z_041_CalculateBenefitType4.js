///////////////////////////////////////////////////////////////////////////////
// 保險公司 - 計算類手術理賠 Type4 UI 功能

var CalculateBenefitType4Manager = (function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private

  var function_name = '計算類手術理賠 Type4';

  // Constructor
  function CalculateBenefitType4Manager() {}

  function Table() {
    return $("table.list_calc_type4");
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
    html = html + '<th>daily_benefit_amount</th>';
    html = html + '<th>policy_claimable_amount</th>';
    html = html + '<th>hospital_days</th>';
    html = html + '<th>fee</th>';
    html = html + '<th>claim_adjustment</th>';
    html = html + '<th>result</th>';
    html = html + '</tr>';

    Table().append(html);
    TableCreateTHEAD();
  }

  function AppendTableBody(daily_benefit_amount, policy_claimable_amount, hospital_days, fee, claim_adjustment, result) {
    daily_benefit_amount = typeof daily_benefit_amount !== 'undefined' ? daily_benefit_amount : '';
    policy_claimable_amount = typeof policy_claimable_amount !== 'undefined' ? policy_claimable_amount : '';
    hospital_days = typeof hospital_days !== 'undefined' ? hospital_days : '';
    fee = typeof fee !== 'undefined' ? fee : '';
    claim_adjustment = typeof claim_adjustment !== 'undefined' ? claim_adjustment : '';
    result = typeof result !== 'undefined' ? result : '';

    var row_count = Table().find("tr").length;

    var html = '<tr>';
    html = html + '<th scope="row">' + row_count + '</th>';
    html = html + '<td>' + daily_benefit_amount + '</td>';
    html = html + '<td>' + policy_claimable_amount + '</td>';
    html = html + '<td>' + hospital_days + '</td>';
    html = html + '<td>' + fee + '</td>';
    html = html + '<td>' + claim_adjustment + '</td>';
    html = html + '<td>' + result + '</td>';
    html = html + '</tr>';

    var table = Table();
    var tbody = table.find("tbody");

    if (tbody.length===0){  //if there is no thead element, add one.
      tbody = $("<tbody></tbody>").appendTo(table);    
    }

    $(html).appendTo(tbody);
  };

  function ReloadList() {
    ClearList();
    AppendTableHead();
    var daily_benefit_amount = CalculateBenefitType4._originalContractObject.daily_benefit_amount().toNumber();
    var policy_claimable_amount = CalculateBenefitType4._originalContractObject.policy_claimable_amount().toNumber();
    var hospital_days = CalculateBenefitType4._originalContractObject.hospital_days().toNumber();
    var fee = CalculateBenefitType4._originalContractObject.fee().toNumber();
    var claim_adjustment = CalculateBenefitType4._originalContractObject.claim_adjustment().toNumber()/1000000000.000000000;
    var result = CalculateBenefitType4._originalContractObject.result().toNumber()/1000000000.000000000;
    AppendTableBody(daily_benefit_amount, policy_claimable_amount, hospital_days, fee, claim_adjustment, result);
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Public

  CalculateBenefitType4Manager.prototype.Init = function () {
    // Init
    ReloadList();
    $("#calculate_benefit_type_4 button.calculate_benefit_type_4").click(function () {
      addBoldToLog('[開始] ' + function_name);

      var insured_person_ID = $("#calculate_benefit_type_4 .insured_person_ID").val();
      var insurance_policy_package_ID = $("#calculate_benefit_type_4 .insurance_policy_package_ID").val();
      var insurance_policy_ID = $("#calculate_benefit_type_4 .insurance_policy_ID").val();
      var medical_record_ID = $("#calculate_benefit_type_4 .medical_record_ID").val();
      var benefit_item_ID = $("#calculate_benefit_type_4 .benefit_item_ID").val();

      var start_date = moment();
      addMomentToLog(start_date);

      addCodeToLog('insured_person_ID = ' + insured_person_ID);
      addCodeToLog('insurance_policy_package_ID = ' + insurance_policy_package_ID);
      addCodeToLog('insurance_policy_ID = ' + insurance_policy_ID);
      addCodeToLog('medical_record_ID = ' + medical_record_ID);
      addCodeToLog('benefit_item_ID = ' + benefit_item_ID);
      addCodeToLog("CalculateBenefitType4.CalculateBenefit(insured_person_ID, insurance_policy_package_ID, insurance_policy_ID, medical_record_ID, benefit_item_ID);");
      addBarToLog();

      var event_listener = CalculateBenefitType4._originalContractObject.e_CalculateBenefit({});
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

          ReloadList();
        } else {
          addJsonToLog(err);
        }
        event_listener.stopWatching();
      });

      CalculateBenefitType4.CalculateBenefit(insured_person_ID, insurance_policy_package_ID, insurance_policy_ID, medical_record_ID, benefit_item_ID, {gas: 300000}).then(function (txHash) {
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

  return CalculateBenefitType4Manager;
})();

var CalculateBenefitType4Manager = new CalculateBenefitType4Manager();