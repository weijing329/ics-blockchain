pragma solidity ^0.4.6;
contract Enrollment {
  // composite_key : string = insured_person_ID|insurance_policy_package_ID|insurance_policy_ID
  // EnrollmentHash : bytes32 = web3.sha3({enrollment_json})
  mapping (string => bytes32) private cpk_Enrollment_hash;
  mapping (string => uint) private cpk_daily_benefit_amount;

  // composite_key_hash = keccak256(composite_key)
  event e_SetEnrollment(bytes32 indexed composite_key_hash, bytes32 enrollment_hash);
  function SetEnrollment(string composite_key, bytes32 enrollment_hash, uint daily_benefit_amount) {
    cpk_Enrollment_hash[composite_key] = enrollment_hash;
    cpk_daily_benefit_amount[composite_key] = daily_benefit_amount;

    e_SetEnrollment(keccak256(composite_key), enrollment_hash);
  }

  function GetEnrollment(string composite_key) constant returns (bytes32) {
    return cpk_Enrollment_hash[composite_key];
  }

  function Get_daily_benefit_amount(string composite_key) constant returns (uint) {
    return cpk_daily_benefit_amount[composite_key];
  }
}