pragma solidity ^0.4.6;

import "lib/ConvertTypes.sol";

import "shared/ContractsAddress.sol";
import "insurance/Enrollment.sol";
import "insurance/ContractTerm.sol";
import "insurance/MedicalRecord.sol";
import "insurance/InsurancePolicy.sol";
import "insurance/ClaimRecord.sol";

contract InsuranceCompany {

  ContractsAddress private _ContractsAddress;
  Enrollment private _Enrollment;
  ContractTerm private _ContractTerm;
  MedicalRecord private _MedicalRecord;
  InsurancePolicy private _InsurancePolicy;
  ClaimRecord private _ClaimRecord;

  address public h_ContractsAddress;
  address public h_Enrollment;
  address public h_ContractTerm;
  address public h_MedicalRecord;
  address public h_InsurancePolicy;
  address public h_ClaimRecord;

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

    h_InsurancePolicy = _ContractsAddress.GetAddress('InsurancePolicy');
    if (h_InsurancePolicy != 0x0) {
      _InsurancePolicy = InsurancePolicy(h_InsurancePolicy);
    }

    h_ClaimRecord = _ContractsAddress.GetAddress('ClaimRecord');
    if (h_ClaimRecord != 0x0) {
      _ClaimRecord = ClaimRecord(h_ClaimRecord);
    }
  }

  // /////////////////////////////////////////////////////////////////////////////
  // // vvvvv 【註冊保戶保單】vvvvv 
  // function SetEnrollment(string composite_key, bytes32 enrollment_hash, uint daily_benefit_amount, uint policy_claimable_amount) {
  //   _Enrollment.SetEnrollment(composite_key, enrollment_hash, daily_benefit_amount, policy_claimable_amount);
  // }

  // function GetEnrollment(string composite_key) constant returns (bytes32) {
  //   return _Enrollment.GetEnrollment(composite_key);
  // }

  // function Get_daily_benefit_amount(string composite_key) constant returns (uint) {
  //   return _Enrollment.Get_daily_benefit_amount(composite_key);
  // }

  // function Get_policy_claimable_amount(string composite_key) constant returns (uint) {
  //   return _Enrollment.Get_policy_claimable_amount(composite_key);
  // }
  // // ^^^^^ 【註冊保戶保單】^^^^^ 

  // /////////////////////////////////////////////////////////////////////////////
  // // vvvvv 【契約內容】vvvvv 
  // function SetContractTerm(string composite_key, bytes32 contract_term_hash, uint claim_adjustment) {
  //   _ContractTerm.SetContractTerm(composite_key, contract_term_hash, claim_adjustment);
  // }

  // function GetContractTerm(string composite_key) constant returns (bytes32) {
  //   return _ContractTerm.GetContractTerm(composite_key);
  // }

  // function Get_claim_adjustment(string composite_key) constant returns (uint) {
  //   return _ContractTerm.Get_claim_adjustment(composite_key);
  // }
  // // ^^^^^ 【契約內容】^^^^^ 

  // /////////////////////////////////////////////////////////////////////////////
  // // vvvvv 【醫療記錄】vvvvv 
  // function SetMedicalRecord(string medical_record_ID, bytes32 medical_record_hash, uint hospital_days, uint fee) {
  //   _MedicalRecord.SetMedicalRecord(medical_record_ID, medical_record_hash, hospital_days, fee);
  // }

  // function GetMedicalRecord(string medical_record_ID) constant returns (bytes32) {
  //   return _MedicalRecord.GetMedicalRecord(medical_record_ID);
  // }

  // function Get_hospital_days(string medical_record_ID) constant returns (uint) {
  //   return _MedicalRecord.Get_hospital_days(medical_record_ID);
  // }

  // function Get_fee(string medical_record_ID) constant returns (uint) {
  //   return _MedicalRecord.Get_fee(medical_record_ID);
  // }
  // // ^^^^^ 【醫療記錄】^^^^^ 

  // /////////////////////////////////////////////////////////////////////////////
  // // vvvvv 【保險契約】vvvvv 
  // function SetInsurancePolicy(string composite_key, bytes32 row_hash, address contract_address) {
  //   _InsurancePolicy.SetInsurancePolicy(composite_key, row_hash, contract_address);
  // }

  // function InsurancePolicy_row_hash(string composite_key) constant returns (bytes32) {
  //   return _InsurancePolicy.Get_row_hash(composite_key);
  // }

  // function InsurancePolicy_contract_address(string composite_key) constant returns (address) {
  //   return _InsurancePolicy.Get_contract_address(composite_key);
  // }
  // // ^^^^^ 【保險契約】^^^^^ 

  /////////////////////////////////////////////////////////////////////////////
  // vvvvv 【理賠案件】vvvvv 
  function SetClaimRecord(string composite_key, bytes32 row_hash, string insured_person_ID, string medical_record_ID, uint eligible_benefit_amount, string claim_paid_TR_ID, uint status_code) {
    _ClaimRecord.SetClaimRecord(composite_key, row_hash, insured_person_ID, medical_record_ID, eligible_benefit_amount, claim_paid_TR_ID, status_code);
  }

  function ClaimRecord_row_hash(string composite_key) constant returns (bytes32) {
    return _ClaimRecord.Get_row_hash(composite_key);
  }

  function ClaimRecord_insured_person_ID(string composite_key) constant returns (string) {
    string memory insured_person_ID = ConvertTypes.Bytes32ToString(_ClaimRecord.Get_insured_person_ID_Bytes32(composite_key));
    return insured_person_ID;
  }

  // function Get_insured_person_ID_Bytes32(string composite_key) constant returns (bytes32) {
  //   return ConvertTypes.StringToBytes32(cpk_S_ClaimRecord[composite_key].insured_person_ID);
  // }

  function ClaimRecord_medical_record_ID(string composite_key) constant returns (string) {
    string memory medical_record_ID = ConvertTypes.Bytes32ToString(_ClaimRecord.Get_medical_record_ID_Bytes32(composite_key));
    return medical_record_ID;
  }

  // function Get_medical_record_ID_Bytes32(string composite_key) constant returns (bytes32) {
  //   return ConvertTypes.StringToBytes32(cpk_S_ClaimRecord[composite_key].medical_record_ID);
  // }

  function ClaimRecord_eligible_benefit_amount(string composite_key) constant returns (uint) {
    return _ClaimRecord.Get_eligible_benefit_amount(composite_key);
  }

  function ClaimRecord_claim_paid_TR_ID(string composite_key) constant returns (string) {
    string memory claim_paid_TR_ID = ConvertTypes.Bytes32ToString(_ClaimRecord.Get_claim_paid_TR_ID_Bytes32(composite_key));
    return claim_paid_TR_ID;
  }

  // function Get_claim_paid_TR_ID_Bytes32(string composite_key) constant returns (bytes32) {
  //   return ConvertTypes.StringToBytes32(cpk_S_ClaimRecord[composite_key].claim_paid_TR_ID);
  // }

  function ClaimRecord_status_code(string composite_key) constant returns (uint) {
    return _ClaimRecord.Get_status_code(composite_key);
  }
  // ^^^^^ 【理賠案件】^^^^^ 
}
