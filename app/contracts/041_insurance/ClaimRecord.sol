pragma solidity ^0.4.6;

import "000_lib/maths.sol";

import "001_lib/ConvertTypes.sol";

import "010_base_class/TableRowDataStorage.sol";

import "020_shared/ContractsAddress.sol";
import "020_shared/ConcateCPK.sol";

import "040_insurance/Enrollment.sol";
import "040_insurance/ContractTerm.sol";
import "040_insurance/MedicalRecord.sol";
import "040_insurance/InsurancePolicy.sol";
import "040_insurance/PolicyCalculation.sol";

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
  ConcateCPK private _ConcateCPK;
  Enrollment private _Enrollment;
  ContractTerm private _ContractTerm;
  MedicalRecord private _MedicalRecord;
  InsurancePolicy private _InsurancePolicy;

  address public h_ContractsAddress;
  address public h_ConcateCPK;
  address public h_Enrollment;
  address public h_ContractTerm;
  address public h_MedicalRecord;
  address public h_InsurancePolicy;

  uint public small_benefit_cap; // Int

  function SetSmalBenefitCap(uint _small_benefit_cap) {
    small_benefit_cap = _small_benefit_cap;
  }

  function SetContractAddress(address contracts_address) {
    h_ContractsAddress = contracts_address;
    _ContractsAddress = ContractsAddress(h_ContractsAddress);

    ReloadContractAddress();
  }

  function ReloadContractAddress() {
    h_ConcateCPK = _ContractsAddress.GetAddress('ConcateCPK');
    if (h_ConcateCPK != 0x0) {
      _ConcateCPK = ConcateCPK(h_ConcateCPK);
    }

    h_Enrollment = _ContractsAddress.GetAddress('Enrollment');
    if (h_Enrollment != 0x0) {
      _Enrollment = Enrollment(h_Enrollment);
    }
    
    h_ContractTerm = _ContractsAddress.GetAddress('ContractTerm');
    if (h_ContractTerm != 0x0) {
      _ContractTerm = ContractTerm(h_ContractTerm);
    }

    h_MedicalRecord = _ContractsAddress.GetAddress('MedicalRecord');
    if (h_MedicalRecord != 0x0) {
      _MedicalRecord = MedicalRecord(h_MedicalRecord);
    }

    h_InsurancePolicy = _ContractsAddress.GetAddress('InsurancePolicy');
    if (h_InsurancePolicy != 0x0) {
      _InsurancePolicy = InsurancePolicy(h_InsurancePolicy);
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
  function Get_eligible_benefit_amount(string row_CPK) constant returns (uint) {
    return cpk_S_ClaimRecord[row_CPK].eligible_benefit_amount;
  }

  // for other Contract
  function Get_status_code(string row_CPK) constant returns (uint) {
    return cpk_S_ClaimRecord[row_CPK].status_code;
  }

  function ConcateEnrollmentCPK(string insured_person_ID, string insurance_policy_package_ID, string insurance_policy_ID) returns (string) {
    bytes32 b_enrollment_CPK = _ConcateCPK.ConcatCPKtoBytes32(insured_person_ID, insurance_policy_package_ID, insurance_policy_ID);
    string memory enrollment_CPK = ConvertTypes.Bytes32ToString(b_enrollment_CPK);
    return enrollment_CPK;
  }

  function ConcateContractTermCPK(string insurance_policy_ID, string benefit_item_ID) returns (string) {
    bytes32 b_contract_term_CPK = _ConcateCPK.ConcatCPKtoBytes32(insurance_policy_ID, benefit_item_ID);
    string memory contract_term_CPK = ConvertTypes.Bytes32ToString(b_contract_term_CPK);
    return contract_term_CPK;
  }

  string public insured_person_ID;
  string public medical_record_ID;
  uint public eligible_benefit_amount;

  function CalculateBenefit(string row_CPK, string insurance_policy_package_ID, string insurance_policy_ID, string benefit_item_ID) {
    insured_person_ID = cpk_S_ClaimRecord[row_CPK].insured_person_ID;
    medical_record_ID = cpk_S_ClaimRecord[row_CPK].medical_record_ID;
    eligible_benefit_amount = CalculateEligibleAmount(insured_person_ID, insurance_policy_package_ID, insurance_policy_ID, medical_record_ID, benefit_item_ID);
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

  uint public result;

  function CalculateEligibleAmount(string insured_person_ID, string insurance_policy_package_ID, string insurance_policy_ID, string medical_record_ID, string benefit_item_ID) returns (uint) {

    string memory enrollment_CPK = ConcateEnrollmentCPK(insured_person_ID, insurance_policy_package_ID, insurance_policy_ID);
    string memory contract_term_CPK = ConcateContractTermCPK(insurance_policy_ID, benefit_item_ID);

    uint daily_benefit_amount = _Enrollment.Get_daily_benefit_amount(enrollment_CPK);
    uint policy_claimable_amount = _Enrollment.Get_policy_claimable_amount(enrollment_CPK);
    uint hospital_days = _MedicalRecord.Get_hospital_days(medical_record_ID);
    uint fee = _MedicalRecord.Get_fee(medical_record_ID);
    uint claim_adjustment = _ContractTerm.Get_claim_adjustment(contract_term_CPK);

    address h_policy_calculation = _InsurancePolicy.Get_contract_address(insurance_policy_ID);
    PolicyCalculation _PolicyCalculation;
    _PolicyCalculation = PolicyCalculation(h_policy_calculation);
    
    result = _PolicyCalculation.Calculate(daily_benefit_amount, policy_claimable_amount, hospital_days, fee, claim_adjustment);

    return result;
  }

  // for other Contract
  event e_SetStatusCode(bytes32 indexed row_CPK_hash, string row_CPK, uint status_code);
  function Set_status_code(string row_CPK, uint status_code) {
    e_SetStatusCode(keccak256(row_CPK), row_CPK, status_code);
  }
}