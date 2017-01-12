pragma solidity ^0.4.6;

import "shared/ContractsAddress.sol";
import "insurance/Enrollment.sol";
import "insurance/ContractTerm.sol";

contract InsuranceCompany {

  ContractsAddress private _ContractsAddress;
  Enrollment private _Enrollment;
  ContractTerm private _ContractTerm;

  address public h_ContractsAddress;
  address public h_Enrollment;
  address public h_ContractTerm;

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
  }

  /////////////////////////////////////////////////////////////////////////////
  // vvvvv 【註冊保戶保單】vvvvv 
  function SetEnrollment(string composite_key, bytes32 enrollment_hash, uint daily_benefit_amount) {
    _Enrollment.SetEnrollment(composite_key, enrollment_hash, daily_benefit_amount);
  }

  function GetEnrollment(string composite_key) constant returns (bytes32) {
    return _Enrollment.GetEnrollment(composite_key);
  }

  function Get_daily_benefit_amount(string composite_key) constant returns (uint) {
    return _Enrollment.Get_daily_benefit_amount(composite_key);
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
}
