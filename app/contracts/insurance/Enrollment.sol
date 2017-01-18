pragma solidity ^0.4.6;
contract Enrollment {

  struct S_Enrollment {
    bytes32 enrollment_hash;
    uint daily_benefit_amount;
    uint policy_claimable_amount;
  }

  // composite_key : string = insured_person_ID|insurance_policy_package_ID|insurance_policy_ID
  // EnrollmentHash : bytes32 = web3.sha3({enrollment_json})
  mapping (string => S_Enrollment) private cpk_S_Enrollment;

  // composite_key_hash = keccak256(composite_key)
  event e_SetEnrollment(bytes32 indexed composite_key_hash, bytes32 enrollment_hash);
  function SetEnrollment(string composite_key, bytes32 enrollment_hash, uint daily_benefit_amount, uint policy_claimable_amount) {
    cpk_S_Enrollment[composite_key] = S_Enrollment(enrollment_hash, daily_benefit_amount, policy_claimable_amount);

    e_SetEnrollment(keccak256(composite_key), enrollment_hash);
  }

  function GetEnrollment(string composite_key) constant returns (bytes32) {
    return cpk_S_Enrollment[composite_key].enrollment_hash;
  }

  function Get_daily_benefit_amount(string composite_key) constant returns (uint) {
    return cpk_S_Enrollment[composite_key].daily_benefit_amount;
  }

  function Get_policy_claimable_amount(string composite_key) constant returns (uint) {
    return cpk_S_Enrollment[composite_key].policy_claimable_amount;
  }
}