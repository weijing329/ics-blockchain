pragma solidity ^0.4.8;

import "010_base_class/TableRowDataStorage.sol";

contract Person is TableRowDataStorage {
  // row_CPK = Person.code
  function SetPerson(string row_CPK, string row_data) {
    TableRowDataStorage.SetTableRowData(row_CPK, row_data);
  }
}
