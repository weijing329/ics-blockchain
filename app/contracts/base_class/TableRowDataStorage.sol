pragma solidity ^0.4.6;
contract TableRowDataStorage {
  string[] private row_CPKs;

  // lastest row data hash
  mapping(string => bytes32) private table_row_data_hash;

  // table_row_PKs -> public_column_name -> public_column_content
  // table_row_PKs -> row_data_json_hash -> private_row_data_json
  mapping(string => mapping (bytes32 => string)) private table_row_data; 

  event e_SetTableRowDataJson(bytes32 indexed row_CPK_hash, bytes32 row_data_json_hash);
  function SetTableRowDataJson(string row_CPK, string row_data_json) internal {
    if (table_row_data_hash[row_CPK] == table_row_data_hash["EMPTY_MAPPING"]) {
      row_CPKs.push(row_CPK);
    }

    bytes32 row_CPK_hash = keccak256(row_CPK);
    bytes32 row_data_json_hash = keccak256(row_data_json);
    table_row_data_hash[row_CPK] = row_data_json_hash;
    table_row_data[row_CPK][row_data_json_hash] = row_data_json;
    e_SetTableRowDataJson(row_CPK_hash, row_data_json_hash);
  }

  function GetRowCount() public constant returns (uint) {
    return row_CPKs.length;
  }

  function GetRowKey(uint index) public constant returns (string) {
    return row_CPKs[index];
  }
  
  function HasRow(string row_CPK) public constant returns (bool) {
    if (table_row_data_hash[row_CPK] == table_row_data_hash["EMPTY_MAPPING"]) {
      return false;
    }
    return true;
  }

  function GetTableRowDataHash(string row_CPK) public constant returns (bytes32) {
    return table_row_data_hash[row_CPK];
  }

  function GetTableRowDataJson(string row_CPK, bytes32 row_data_json_hash) public constant returns (string) {
    return table_row_data[row_CPK][row_data_json_hash];
  }
}
