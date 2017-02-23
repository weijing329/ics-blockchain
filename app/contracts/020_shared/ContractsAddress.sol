pragma solidity ^0.4.8;
contract ContractsAddress {
  mapping (string => address) private contracts_address;

  event e_SetAddress(bytes32 indexed contract_name_hash, address contract_address);
  function SetAddress(string contract_name, address contract_address) {
    contracts_address[contract_name] = contract_address;
    e_SetAddress(keccak256(contract_name), contract_address);
  }

  function GetAddress(string contract_name) constant returns (address) {
    return contracts_address[contract_name];
  }
}