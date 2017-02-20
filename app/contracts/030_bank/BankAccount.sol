pragma solidity ^0.4.6;
contract BankAccount {
  mapping (uint => string) private bank_ID_entity_code; // bank_ID <-> person_code

  event e_SetBankAccount(uint indexed bank_ID, string person_code);
  function SetBankAccount(uint bank_ID, string person_code) {
    bank_ID_entity_code[bank_ID] = person_code;
    e_SetBankAccount(bank_ID, person_code);
  }

  function GetBankAccount(uint bank_ID) constant returns (string) {
    return bank_ID_entity_code[bank_ID];
  }
}
