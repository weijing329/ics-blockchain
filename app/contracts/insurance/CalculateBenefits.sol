pragma solidity ^0.4.6;

import "lib/maths.sol";
import "lib/ConvertTypes.sol";

import "shared/ContractsAddress.sol";
import "shared/ConcateCPK.sol";
import "insurance/Enrollment.sol";
import "insurance/ContractTerm.sol";
import "insurance/MedicalRecord.sol";
import "insurance/InsurancePolicy.sol";
import "insurance/PolicyCalculation.sol";
import "insurance/ClaimRecord.sol";

contract CalculateBenefits {

  ContractsAddress private _ContractsAddress;
  ConcateCPK private _ConcateCPK;
  Enrollment private _Enrollment;
  ContractTerm private _ContractTerm;
  MedicalRecord private _MedicalRecord;
  InsurancePolicy private _InsurancePolicy;
  ClaimRecord private _ClaimRecord;

  address public h_ContractsAddress;
  address public h_ConcateCPK;
  address public h_Enrollment;
  address public h_ContractTerm;
  address public h_MedicalRecord;
  address public h_InsurancePolicy;
  address public h_ClaimRecord;

  function CalculateBenefits(address contracts_address) {
    UpdateContractAddress(contracts_address);
  }

  function UpdateContractAddress(address contracts_address) {
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

    h_ClaimRecord = _ContractsAddress.GetAddress('ClaimRecord');
    if (h_ClaimRecord != 0x0) {
      _ClaimRecord = ClaimRecord(h_ClaimRecord);
    }
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

  function Get_insured_person_ID(string claim_record_ID) returns (string) {
    bytes32 b_insured_person_ID = _ClaimRecord.Get_insured_person_ID_Bytes32(claim_record_ID);
    string memory insured_person_ID = ConvertTypes.Bytes32ToString(b_insured_person_ID);
    return insured_person_ID;
  }

  function Get_medical_record_ID(string claim_record_ID) returns (string) {
    bytes32 b_medical_record_ID = _ClaimRecord.Get_medical_record_ID_Bytes32(claim_record_ID);
    string memory medical_record_ID = ConvertTypes.Bytes32ToString(b_medical_record_ID);
    return medical_record_ID;
  }

  uint public result;

  // return Decimal(19,4)x4
  function CalculateBenefit(string insured_person_ID, string insurance_policy_package_ID, string insurance_policy_ID, string medical_record_ID, string benefit_item_ID) returns (uint) {
    
    // string memory insured_person_ID = Get_insured_person_ID(claim_record_ID); // nested too deep, removal variable
    // string memory medical_record_ID = Get_medical_record_ID(claim_record_ID);

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


}