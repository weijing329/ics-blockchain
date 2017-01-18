pragma solidity ^0.4.6;

import "lib/ConvertTypes.sol";

contract ClaimRecord {
  using strings for *;

  struct S_ClaimRecord {
    bytes32 row_hash;
    string insured_person_ID;
    string medical_record_ID;
    uint eligible_benefit_amount;  // decimal(19,4)x4
    string claim_paid_TR_ID;
    uint status_code;
  }

  // composite_key : string = insurance_policy_ID
  // row_hash : bytes32 = web3.sha3({row_json})
  mapping (string => S_ClaimRecord) private cpk_S_ClaimRecord;

  // composite_key_hash = keccak256(composite_key)
  event e_SetClaimRecord(bytes32 indexed composite_key_hash, bytes32 row_hash);
  function SetClaimRecord(string composite_key, bytes32 row_hash, string insured_person_ID, string medical_record_ID, uint eligible_benefit_amount, string claim_paid_TR_ID, uint status_code) {
    cpk_S_ClaimRecord[composite_key] = S_ClaimRecord(row_hash, insured_person_ID, medical_record_ID, eligible_benefit_amount, claim_paid_TR_ID, status_code);

    e_SetClaimRecord(keccak256(composite_key), row_hash);
  }

  function Get_row_hash(string composite_key) constant returns (bytes32) {
    return cpk_S_ClaimRecord[composite_key].row_hash;
  }

  function Get_insured_person_ID(string composite_key) constant returns (string) {
    return cpk_S_ClaimRecord[composite_key].insured_person_ID;
  }

  function Get_insured_person_ID_Bytes32(string composite_key) constant returns (bytes32) {
    return ConvertTypes.StringToBytes32(cpk_S_ClaimRecord[composite_key].insured_person_ID);
  }

  function Get_medical_record_ID(string composite_key) constant returns (string) {
    return cpk_S_ClaimRecord[composite_key].medical_record_ID;
  }

  function Get_medical_record_ID_Bytes32(string composite_key) constant returns (bytes32) {
    return ConvertTypes.StringToBytes32(cpk_S_ClaimRecord[composite_key].medical_record_ID);
  }

  function Get_eligible_benefit_amount(string composite_key) constant returns (uint) {
    return cpk_S_ClaimRecord[composite_key].eligible_benefit_amount;
  }

  function Get_claim_paid_TR_ID(string composite_key) constant returns (string) {
    return cpk_S_ClaimRecord[composite_key].claim_paid_TR_ID;
  }

  function Get_claim_paid_TR_ID_Bytes32(string composite_key) constant returns (bytes32) {
    return ConvertTypes.StringToBytes32(cpk_S_ClaimRecord[composite_key].claim_paid_TR_ID);
  }

  function Get_status_code(string composite_key) constant returns (uint) {
    return cpk_S_ClaimRecord[composite_key].status_code;
  }
}