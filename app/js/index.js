///////////////////////////////////////////////////////////////////////////////
// Web UI 互動功能整合

$(document).ready(function () {

  // 【記錄合約位置】
  InitContractsAddress();

  // 【政府共用資料】
  GovernmentContractsManager.Init();

  // 【記錄自然人】
  InitPerson();

  // 【保險公司】
  InsuranceCompanyContractsManager.Init();

  // 【註冊保戶保單】
  InitEnrollment();

  // 【記錄契約內容】
  InitContractTerm();

  // 【記錄醫療記錄】
  MedicalRecordManager.Init();
});
