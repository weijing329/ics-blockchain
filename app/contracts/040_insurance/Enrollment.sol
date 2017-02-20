pragma solidity ^0.4.6;

import "010_base_class/TableRowDataStorage.sol";

contract Enrollment is TableRowDataStorage {

  struct S_Enrollment {
    uint daily_benefit_amount;
    uint policy_claimable_amount;
  }

  // row_CPK : string = insured_person_ID|insurance_policy_package_ID|insurance_policy_ID
  mapping (string => S_Enrollment) private cpk_S_Enrollment;

  // for API
  function SetEnrollment(string row_CPK, string row_data, uint daily_benefit_amount, uint policy_claimable_amount) {
    TableRowDataStorage.SetTableRowData(row_CPK, row_data);
    cpk_S_Enrollment[row_CPK] = S_Enrollment(daily_benefit_amount, policy_claimable_amount);
  }

  // for other Contract
  function Get_daily_benefit_amount(string row_CPK) constant returns (uint) {
    return cpk_S_Enrollment[row_CPK].daily_benefit_amount;
  }

  // for other Contract
  function Get_policy_claimable_amount(string row_CPK) constant returns (uint) {
    return cpk_S_Enrollment[row_CPK].policy_claimable_amount;
  }
}