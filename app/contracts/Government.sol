pragma solidity ^0.4.6;

import "shared/ContractsAddress.sol";
import "shared/Person.sol";
import "shared/InternationInjuryAndDisease.sol";

contract Government {
  
  ContractsAddress private _ContractsAddress; 
  Person private _Person;
  InternationInjuryAndDisease private _InternationInjuryAndDisease;

  address public h_ContractsAddress;
  address public h_Person;
  address public h_InternationInjuryAndDisease;

  function Government(address contracts_address) {
    UpdateContractAddress(contracts_address);
  }

  function UpdateContractAddress(address contracts_address) {
    h_ContractsAddress = contracts_address;
    _ContractsAddress = ContractsAddress(h_ContractsAddress);

    ReloadContractAddress();
  }

  function ReloadContractAddress() {
    h_Person = _ContractsAddress.GetAddress('Person');
    if (h_Person != 0x0) {
      _Person = Person(h_Person);
    }

    h_InternationInjuryAndDisease = _ContractsAddress.GetAddress('InternationInjuryAndDisease');
    if (h_InternationInjuryAndDisease != 0x0) {
      _InternationInjuryAndDisease = InternationInjuryAndDisease(h_InternationInjuryAndDisease);
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  // vvvvv 【自然人】vvvvv 
  function SetPerson(string row_CPK, string row_data_json) {
    _Person.SetPerson(row_CPK, row_data_json);
  }
  // ^^^^^ 【自然人】^^^^^ 

  /////////////////////////////////////////////////////////////////////////////
  // vvvvv 【寫入國際傷疾病代碼】vvvvv 
  function SetInternationInjuryAndDisease(string row_CPK, string row_data_json) {
    _InternationInjuryAndDisease.SetInternationInjuryAndDisease(row_CPK, row_data_json);
  }
  // ^^^^^ 【寫入國際傷疾病代碼】^^^^^ 
}
