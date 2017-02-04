pragma solidity ^0.4.6;

import "base_class/TableRowDataStorage.sol";

contract MedicalRecord is TableRowDataStorage {

  struct S_MedicalRecord {
    uint hospital_days; // int
    uint fee; // Decimal(19,4)x4
  }

  // row_CPK : string = medical_record_ID
  mapping (string => S_MedicalRecord) private cpk_S_MedicalRecord;

  // for API
  function SetMedicalRecord(string row_CPK, string row_data, uint hospital_days, uint fee) {
    TableRowDataStorage.SetTableRowData(row_CPK, row_data);
    cpk_S_MedicalRecord[row_CPK] = S_MedicalRecord(hospital_days, fee);
  }

  // for other Contract
  function Get_hospital_days(string row_CPK) constant returns (uint) {
    return cpk_S_MedicalRecord[row_CPK].hospital_days;
  }

  // for other Contract
  function Get_fee(string row_CPK) constant returns (uint) {
    return cpk_S_MedicalRecord[row_CPK].fee;
  }
}