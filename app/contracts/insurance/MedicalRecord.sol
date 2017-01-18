pragma solidity ^0.4.6;
contract MedicalRecord {
  // Mdeical_hash : bytes32 = web3.sha3({medical_record_json})
  mapping (string => bytes32) private id_MedicalRecord_hash;
  mapping (string => uint) private id_hospital_days;
  mapping (string => uint) private id_fee;

  event e_SetMedicalRecord(bytes32 indexed medical_record_ID_hash, bytes32 medical_record_hash);
  function SetMedicalRecord(string medical_record_ID, bytes32 medical_record_hash, uint hospital_days, uint fee) {
    id_MedicalRecord_hash[medical_record_ID] = medical_record_hash;
    id_hospital_days[medical_record_ID] = hospital_days;
    id_fee[medical_record_ID] = fee;

    e_SetMedicalRecord(keccak256(medical_record_ID), medical_record_hash);
  }

  function GetMedicalRecord(string medical_record_ID) constant returns (bytes32) {
    return id_MedicalRecord_hash[medical_record_ID];
  }

  function Get_hospital_days(string medical_record_ID) constant returns (uint) {
    return id_hospital_days[medical_record_ID];
  }

  function Get_fee(string medical_record_ID) constant returns (uint) {
    return id_fee[medical_record_ID];
  }
}