pragma solidity ^0.4.6;
contract ContractTerm {
  // composite_key : string = insurance_policy_ID|benefit_item_ID
  // ContractTermHash : bytes32 = web3.sha3({ContractTerm_json})
  mapping (string => bytes32) private cpk_ContractTerm_hash;
  mapping (string => uint) private cpk_claim_adjustment; // decimal(19,9)x9

  // composite_key_hash = keccak256(composite_key)
  event e_SetContractTerm(bytes32 indexed composite_key_hash, bytes32 contract_term_hash);
  function SetContractTerm(string composite_key, bytes32 contract_term_hash, uint claim_adjustment) {
    cpk_ContractTerm_hash[composite_key] = contract_term_hash;
    cpk_claim_adjustment[composite_key] = claim_adjustment;

    e_SetContractTerm(keccak256(composite_key), contract_term_hash);
  }

  function GetContractTerm(string composite_key) constant returns (bytes32) {
    return cpk_ContractTerm_hash[composite_key];
  }

  function Get_claim_adjustment(string composite_key) constant returns (uint) {
    return cpk_claim_adjustment[composite_key];
  }
}