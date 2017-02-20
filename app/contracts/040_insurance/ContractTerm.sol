pragma solidity ^0.4.6;

import "010_base_class/TableRowDataStorage.sol";

contract ContractTerm is TableRowDataStorage {

  struct S_ContractTerm {
    uint claim_adjustment; // Decimal(19,9)x9
  }

  // row_CPK : string = insurance_policy_ID|benefit_item_ID
  mapping (string => S_ContractTerm) private cpk_S_ContractTerm;

  // for API
  function SetContractTerm(string row_CPK, string row_data, uint claim_adjustment) {
    TableRowDataStorage.SetTableRowData(row_CPK, row_data);
    cpk_S_ContractTerm[row_CPK] = S_ContractTerm(claim_adjustment);
  }

  // for other Contract
  function Get_claim_adjustment(string row_CPK) constant returns (uint) {
    return cpk_S_ContractTerm[row_CPK].claim_adjustment;
  }
}