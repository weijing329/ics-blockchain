pragma solidity ^0.4.6;
contract MedicalRecord {
  // Mdeical_hash : bytes32 = web3.sha3({medical_record_json})
  mapping (uint => bytes32) private id_MedicalRecord_hash;
  mapping (uint => uint) private id_hospital_days;
  mapping (uint => uint) private id_fee;

  event e_SetMedicalRecord(uint indexed medical_record_ID, bytes32 medical_record_hash);
  function SetMedicalRecord(uint medical_record_ID, bytes32 medical_record_hash, uint hospital_days, uint fee) {
    id_MedicalRecord_hash[medical_record_ID] = medical_record_hash;
    id_hospital_days[medical_record_ID] = hospital_days;
    id_fee[medical_record_ID] = fee;

    e_SetMedicalRecord(medical_record_ID, medical_record_hash);
  }

  function GetMedicalRecord(uint medical_record_ID) constant returns (bytes32) {
    return id_MedicalRecord_hash[medical_record_ID];
  }

  function Get_hospital_days(uint medical_record_ID) constant returns (uint) {
    return id_hospital_days[medical_record_ID];
  }

  function Get_fee(uint medical_record_ID) constant returns (uint) {
    return id_fee[medical_record_ID];
  }
}