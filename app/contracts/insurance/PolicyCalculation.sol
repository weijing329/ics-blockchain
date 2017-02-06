pragma solidity ^0.4.6;

import "lib/maths.sol";

contract PolicyCalculation {

  // abstract functions

  // daily_benefit_amount : Int
  // policy_claimable_amount: Int
  // hospital_days : Int
  // fee: Int
  // claim_adjustment : Decimal(19,9)x9
  // return Decimal(19,4)x4
  function Calculate(uint daily_benefit_amount, uint policy_claimable_amount, uint hospital_days, uint fee, uint claim_adjustment) returns(uint) {}
}