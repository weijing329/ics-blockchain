///////////////////////////////////////////////////////////////////////////////
// 寫入理賠案件 UI 功能

var PolicyCalculationManager = (function () {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Private

  // Constructor
  function PolicyCalculationManager() {}

  function List() {
    return $("div.PolicyCalculationTypes");
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

    List().append('<span style="width:300px; display:inline-block;">' + contract_name + '</span><span style="width:600px; display:inline-block;">' + contract_address + '</span>').append("<br>");
  };

  // 【重新載入合約位置清單】
  function ReloadList() {
    ClearList();
    AppendList('contract_name', 'contract_address');
    AppendList();
    AppendList('PolicyCalculationType1 類實支實付', (window["PolicyCalculationType1"] === undefined) ? "" : PolicyCalculationType1.address);
    AppendList('PolicyCalculationType2 類日額給付', (window["PolicyCalculationType2"] === undefined) ? "" : PolicyCalculationType2.address);
    AppendList('PolicyCalculationType3 類綜合型', (window["PolicyCalculationType3"] === undefined) ? "" : PolicyCalculationType3.address);
    AppendList('PolicyCalculationType4 類含手術理賠', (window["PolicyCalculationType4"] === undefined) ? "" : PolicyCalculationType4.address);
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Public
  PolicyCalculationManager.prototype.Init = function () {
    // Init
    ReloadList();
  };

  return PolicyCalculationManager;
})();

var PolicyCalculationManager = new PolicyCalculationManager();