pragma solidity ^0.4.6;

import "lib/maths.sol";
import "lib/ConvertTypes.sol";

import "shared/ContractsAddress.sol";
import "shared/ConcateCPK.sol";
import "insurance/Enrollment.sol";
import "insurance/ContractTerm.sol";
import "insurance/MedicalRecord.sol";

contract CalculateBenefitType4 {

  ContractsAddress private _ContractsAddress;
  ConcateCPK private _ConcateCPK;
  Enrollment private _Enrollment;
  ContractTerm private _ContractTerm;
  MedicalRecord private _MedicalRecord;

  address public h_ContractsAddress;
  address public h_ConcateCPK;
  address public h_Enrollment;
  address public h_ContractTerm;
  address public h_MedicalRecord;

  function CalculateBenefitType4(address contracts_address) {
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
  }

  // daily_benefit_amount : Int
  // policy_claimable_amount: Int
  // hospital_days : Int
  // fee: Int
  // claim_adjustment : Decimal(19,9)x9
  // return Decimal(19,9)x9
  function Type4(uint daily_benefit_amount, uint policy_claimable_amount, uint hospital_days, uint fee, uint claim_adjustment) internal returns(uint) {
    uint a1 = maths.Min(fee, policy_claimable_amount);
    uint a2 = daily_benefit_amount * hospital_days;

    uint b1 = maths.Max(a1, a2) * 1000000000;
    uint b2 = (daily_benefit_amount * claim_adjustment);

    return b1 + b2;
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

  uint public daily_benefit_amount;
  uint public policy_claimable_amount;
  uint public hospital_days;
  uint public fee;
  uint public claim_adjustment;
  uint public result;
  event e_CalculateBenefit(uint daily_benefit_amount, uint policy_claimable_amount, uint hospital_days, uint fee, uint claim_adjustment, uint result);
  function CalculateBenefit(string insured_person_ID, string insurance_policy_package_ID, string insurance_policy_ID, string medical_record_ID, string benefit_item_ID) returns (uint) {
    
    string memory enrollment_CPK = ConcateEnrollmentCPK(insured_person_ID, insurance_policy_package_ID, insurance_policy_ID);
    string memory contract_term_CPK = ConcateContractTermCPK(insurance_policy_ID, benefit_item_ID);

    daily_benefit_amount = _Enrollment.Get_daily_benefit_amount(enrollment_CPK);
    policy_claimable_amount = _Enrollment.Get_policy_claimable_amount(enrollment_CPK);
    hospital_days = _MedicalRecord.Get_hospital_days(medical_record_ID);
    fee = _MedicalRecord.Get_fee(medical_record_ID);
    claim_adjustment = _ContractTerm.Get_claim_adjustment(contract_term_CPK);

    result = Type4(daily_benefit_amount, policy_claimable_amount, hospital_days, fee, claim_adjustment);

    e_CalculateBenefit(daily_benefit_amount, policy_claimable_amount, hospital_days, fee, claim_adjustment, result);

    return result;
  }
}