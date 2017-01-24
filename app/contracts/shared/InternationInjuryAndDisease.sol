pragma solidity ^0.4.6;

import "base_class/TableRowDataStorage.sol";

contract InternationInjuryAndDisease is TableRowDataStorage {
  // row_CPK = InternationInjuryAndDisease.code
  function SetInternationInjuryAndDisease(string row_CPK, string row_data_json) {
    TableRowDataStorage.SetTableRowDataJson(row_CPK, row_data_json);
  }
}
