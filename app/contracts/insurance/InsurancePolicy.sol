pragma solidity ^0.4.6;
contract InsurancePolicy {

  struct S_InsurancePolicy {
    bytes32 row_hash;
    address contract_address;
  }

  // composite_key : string = insurance_policy_ID
  // row_hash : bytes32 = web3.sha3({row_json})
  mapping (string => S_InsurancePolicy) private cpk_S_InsurancePolicy;

  // composite_key_hash = keccak256(composite_key)
  event e_SetInsurancePolicy(bytes32 indexed composite_key_hash, bytes32 row_hash);
  function SetInsurancePolicy(string composite_key, bytes32 row_hash, address contract_address) {
    cpk_S_InsurancePolicy[composite_key] = S_InsurancePolicy(row_hash, contract_address);

    e_SetInsurancePolicy(keccak256(composite_key), row_hash);
  }

  function Get_row_hash(string composite_key) constant returns (bytes32) {
    return cpk_S_InsurancePolicy[composite_key].row_hash;
  }

  function Get_contract_address(string composite_key) constant returns (address) {
    return cpk_S_InsurancePolicy[composite_key].contract_address;
  }
}