pragma solidity ^0.4.6;

import "base_class/TableRowDataStorage.sol";
import "lib/ConvertTypes.sol";
import "shared/ContractsAddress.sol";
import "insurance/CalculateBenefits.sol";

contract ClaimRecord is TableRowDataStorage {
  using strings for *;

  struct S_ClaimRecord {
    string insured_person_ID;
    string medical_record_ID;
    uint eligible_benefit_amount;  // Decimal(19,4)x4
    uint status_code;
  }

  // row_CPK : string = claim_record_ID
  mapping (string => S_ClaimRecord) private cpk_S_ClaimRecord;

  ContractsAddress private _ContractsAddress;
  CalculateBenefits private _CalculateBenefits;

  address public h_ContractsAddress;
  address public h_CalculateBenefits;

  uint public small_benefit_cap;

  function SetSmalBenefitCap(uint _small_benefit_cap) {
    small_benefit_cap = _small_benefit_cap;
  }

  function SetContractAddress(address contracts_address) {
    h_ContractsAddress = contracts_address;
    _ContractsAddress = ContractsAddress(h_ContractsAddress);

    ReloadContractAddress();
  }

  function ReloadContractAddress() {
    h_CalculateBenefits = _ContractsAddress.GetAddress('CalculateBenefits');
    if (h_CalculateBenefits != 0x0) {
      _CalculateBenefits = CalculateBenefits(h_CalculateBenefits);
    }
  }

  // for API
  function SetClaimRecord(string row_CPK, string row_data, string insured_person_ID, string medical_record_ID, uint eligible_benefit_amount, uint status_code) {
    TableRowDataStorage.SetTableRowData(row_CPK, row_data);
    cpk_S_ClaimRecord[row_CPK] = S_ClaimRecord(insured_person_ID, medical_record_ID, eligible_benefit_amount, status_code);
  }

  // for other Contract
  function Get_insured_person_ID(string row_CPK) constant returns (string) {
    return cpk_S_ClaimRecord[row_CPK].insured_person_ID;
  }

  // for other Contract
  function Get_insured_person_ID_Bytes32(string row_CPK) constant returns (bytes32) {
    return ConvertTypes.StringToBytes32(cpk_S_ClaimRecord[row_CPK].insured_person_ID);
  }

  // for other Contract
  function Get_medical_record_ID(string row_CPK) constant returns (string) {
    return cpk_S_ClaimRecord[row_CPK].medical_record_ID;
  }

  // for other Contract
  function Get_medical_record_ID_Bytes32(string row_CPK) constant returns (bytes32) {
    return ConvertTypes.StringToBytes32(cpk_S_ClaimRecord[row_CPK].medical_record_ID);
  }

  // for other Contract
  function Get_eligible_benefit_amount(string row_CPK) constant returns (uint) {
    return cpk_S_ClaimRecord[row_CPK].eligible_benefit_amount;
  }

  // for other Contract
  function Get_status_code(string row_CPK) constant returns (uint) {
    return cpk_S_ClaimRecord[row_CPK].status_code;
  }

  string public insured_person_ID;
  string public medical_record_ID;
  uint public eligible_benefit_amount;

  function CalculateBenefit(string row_CPK, string insurance_policy_package_ID, string insurance_policy_ID, string benefit_item_ID) {
    insured_person_ID = cpk_S_ClaimRecord[row_CPK].insured_person_ID;
    medical_record_ID = cpk_S_ClaimRecord[row_CPK].medical_record_ID;
    eligible_benefit_amount = _CalculateBenefits.CalculateBenefit(insured_person_ID, insurance_policy_package_ID, insurance_policy_ID, medical_record_ID, benefit_item_ID);
    cpk_S_ClaimRecord[row_CPK].eligible_benefit_amount = eligible_benefit_amount; // return Decimal(19,4)x4

    uint new_status_code;
    if (eligible_benefit_amount > (small_benefit_cap * 10000) ) {
      new_status_code = 20;
    } else {
      new_status_code = 30;
    }
    cpk_S_ClaimRecord[row_CPK].status_code = new_status_code;
    Set_status_code(row_CPK, new_status_code);
  }

  // for other Contract
  event e_SetStatusCode(bytes32 indexed row_CPK_hash, string row_CPK, uint status_code);
  function Set_status_code(string row_CPK, uint status_code) {
    e_SetStatusCode(keccak256(row_CPK), status_code);
  }
}