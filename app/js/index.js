///////////////////////////////////////////////////////////////////////////////
// Web UI 互動功能整合

$(document).ready(function () {

  // 【記錄合約位置】
  InitContractsAddress();

  // 【政府共用資料】
  GovernmentContractsManager.Init();

  // 【記錄自然人】
  PersonManager.Init();

  // [寫入國際傷疾病代碼]
  InternationInjuryAndDiseaseManager.Init();

  // 【保險公司】
  InsuranceCompanyContractsManager.Init();

  // 【註冊保戶保單】
  EnrollmentManager.Init();

  // 【記錄契約內容】
  InitContractTerm();

  // 【記錄醫療記錄】
  MedicalRecordManager.Init();

  // 【計算類手術理賠 Type4】
  CalculateBenefitType4Manager.Init();

  // 【寫入保險契約】
  InsurancePolicyManager.Init();

  // 【寫入理賠案件】
  ClaimRecordManager.Init();
});
