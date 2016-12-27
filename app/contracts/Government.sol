pragma solidity ^0.4.6;

import "shared/ContractsAddress.sol";
import "shared/Person.sol";

contract Government {
  
  ContractsAddress private _ContractsAddress; 
  Person private _Person;

  function Government(address contracts_address) {
    _ContractsAddress = ContractsAddress(contracts_address);
    _Person = Person(_ContractsAddress.GetAddress('Person'));
  }

  function SetPerson(string person_code, bytes32 person_hash) {
    _Person.SetPerson(person_code, person_hash);
  }

  function GetPerson(string person_code) constant returns (bytes32) {
    return _Person.GetPerson(person_code);
  }
}
