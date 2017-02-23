pragma solidity ^0.4.8;

import "010_base_class/TableRowDataStorage.sol";

contract TransferRecord is TableRowDataStorage {

  struct S_TransferRecord {
    uint transfer_amount;  // Decimal(19,4)x4
    uint status_code;
  }

  // row_CPK : string = transfer_record_ID
  mapping (string => S_TransferRecord) private cpk_S_TransferRecord;

  // for API
  function SetTransferRecord(string row_CPK, string row_data, uint transfer_amount, uint status_code) {
    TableRowDataStorage.SetTableRowData(row_CPK, row_data);
    cpk_S_TransferRecord[row_CPK] = S_TransferRecord(transfer_amount, status_code);
  }

  // for other Contract
  function Get_transfer_amount(string row_CPK) constant returns (uint) {
    return cpk_S_TransferRecord[row_CPK].transfer_amount;
  }

  // for other Contract
  function Get_status_code(string row_CPK) constant returns (uint) {
    return cpk_S_TransferRecord[row_CPK].status_code;
  }

  // for other Contract
  event e_SetStatusCode(bytes32 indexed row_CPK_hash, string row_CPK, uint status_code);
  function Set_status_code(string row_CPK, uint status_code) {
    e_SetStatusCode(keccak256(row_CPK), row_CPK, status_code);
  }
}