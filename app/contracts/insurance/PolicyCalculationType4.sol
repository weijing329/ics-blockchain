pragma solidity ^0.4.6;

import "insurance/PolicyCalculation.sol";

contract PolicyCalculationType4 is PolicyCalculation {

  // Override functions

  // daily_benefit_amount : Int
  // policy_claimable_amount: Int
  // hospital_days : Int
  // fee: Int
  // claim_adjustment : Decimal(19,9)x9
  // return Decimal(19,9)x9
  function Calculate(uint daily_benefit_amount, uint policy_claimable_amount, uint hospital_days, uint fee, uint claim_adjustment) returns(uint) {
    uint a1 = maths.Min(fee, policy_claimable_amount);
    uint a2 = daily_benefit_amount * hospital_days;

    uint b1 = maths.Max(a1, a2) * 1000000000;
    uint b2 = (daily_benefit_amount * claim_adjustment);

    return b1 + b2;
  }
}