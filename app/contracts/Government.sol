pragma solidity ^0.4.6;

import "shared/ContractsAddress.sol";
import "shared/Person.sol";

contract Government {
  
  ContractsAddress private _ContractsAddress; 
  Person private _Person;

  address public h_ContractsAddress;
  address public h_Person;

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
  }

  /////////////////////////////////////////////////////////////////////////////
  // vvvvv 【自然人】vvvvv 
  function SetPerson(string person_code, bytes32 person_hash) {
    _Person.SetPerson(person_code, person_hash);
  }

  function GetPerson(string person_code) constant returns (bytes32) {
    return _Person.GetPerson(person_code);
  }
  // ^^^^^ 【自然人】^^^^^ 
}
