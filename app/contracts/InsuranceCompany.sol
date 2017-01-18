pragma solidity ^0.4.6;

import "shared/ContractsAddress.sol";
import "insurance/Enrollment.sol";
import "insurance/ContractTerm.sol";
import "insurance/MedicalRecord.sol";

contract InsuranceCompany {

  ContractsAddress private _ContractsAddress;
  Enrollment private _Enrollment;
  ContractTerm private _ContractTerm;
  MedicalRecord private _MedicalRecord;

  address public h_ContractsAddress;
  address public h_Enrollment;
  address public h_ContractTerm;
  address public h_MedicalRecord;

  function InsuranceCompany(address contracts_address) {
    UpdateContractAddress(contracts_address);
  }

  function UpdateContractAddress(address contracts_address) {
    h_ContractsAddress = contracts_address;
    _ContractsAddress = ContractsAddress(h_ContractsAddress);

    ReloadContractAddress();
  }

  function ReloadContractAddress() {
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

  /////////////////////////////////////////////////////////////////////////////
  // vvvvv 【註冊保戶保單】vvvvv 
  function SetEnrollment(string composite_key, bytes32 enrollment_hash, uint daily_benefit_amount, uint policy_claimable_amount) {
    _Enrollment.SetEnrollment(composite_key, enrollment_hash, daily_benefit_amount, policy_claimable_amount);
  }

  function GetEnrollment(string composite_key) constant returns (bytes32) {
    return _Enrollment.GetEnrollment(composite_key);
  }

  function Get_daily_benefit_amount(string composite_key) constant returns (uint) {
    return _Enrollment.Get_daily_benefit_amount(composite_key);
  }

  function Get_policy_claimable_amount(string composite_key) constant returns (uint) {
    return _Enrollment.Get_policy_claimable_amount(composite_key);
  }
  // ^^^^^ 【註冊保戶保單】^^^^^ 

  /////////////////////////////////////////////////////////////////////////////
  // vvvvv 【契約內容】vvvvv 
  function SetContractTerm(string composite_key, bytes32 contract_term_hash, uint claim_adjustment) {
    _ContractTerm.SetContractTerm(composite_key, contract_term_hash, claim_adjustment);
  }

  function GetContractTerm(string composite_key) constant returns (bytes32) {
    return _ContractTerm.GetContractTerm(composite_key);
  }

  function Get_claim_adjustment(string composite_key) constant returns (uint) {
    return _ContractTerm.Get_claim_adjustment(composite_key);
  }
  // ^^^^^ 【契約內容】^^^^^ 

  /////////////////////////////////////////////////////////////////////////////
  // vvvvv 【醫療記錄】vvvvv 
  function SetMedicalRecord(string medical_record_ID, bytes32 medical_record_hash, uint hospital_days, uint fee) {
    _MedicalRecord.SetMedicalRecord(medical_record_ID, medical_record_hash, hospital_days, fee);
  }

  function GetMedicalRecord(string medical_record_ID) constant returns (bytes32) {
    return _MedicalRecord.GetMedicalRecord(medical_record_ID);
  }

  function Get_hospital_days(string medical_record_ID) constant returns (uint) {
    return _MedicalRecord.Get_hospital_days(medical_record_ID);
  }

  function Get_fee(string medical_record_ID) constant returns (uint) {
    return _MedicalRecord.Get_fee(medical_record_ID);
  }
  // ^^^^^ 【醫療記錄】^^^^^ 
}
