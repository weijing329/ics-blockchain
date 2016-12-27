pragma solidity ^0.4.6;
contract Person {
  mapping (string => bytes32) private code_PersonHash;

  event e_SetPerson(bytes32 indexed person_code_hash, bytes32 person_hash);
  function SetPerson(string person_code, bytes32 person_hash) {
    code_PersonHash[person_code] = person_hash;
    e_SetPerson(keccak256(person_code), person_hash);
  }

  function GetPerson(string person_code) constant returns (bytes32) {
    return code_PersonHash[person_code];
  }
}
