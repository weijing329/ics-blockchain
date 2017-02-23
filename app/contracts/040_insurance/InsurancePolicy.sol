pragma solidity ^0.4.8;

import "010_base_class/TableRowDataStorage.sol";

contract InsurancePolicy is TableRowDataStorage {

  struct S_InsurancePolicy {
    address contract_address;
  }

  // row_CPK : string = insurance_policy_ID
  mapping (string => S_InsurancePolicy) private cpk_S_InsurancePolicy;

  // for API
  function SetInsurancePolicy(string row_CPK, string row_data, address contract_address) {
    TableRowDataStorage.SetTableRowData(row_CPK, row_data);
    cpk_S_InsurancePolicy[row_CPK] = S_InsurancePolicy(contract_address);
  }

  // for other Contract
  function Get_contract_address(string row_CPK) constant returns (address) {
    return cpk_S_InsurancePolicy[row_CPK].contract_address;
  }
}