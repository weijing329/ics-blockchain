pragma solidity ^0.4.8;

import "040_insurance/PolicyCalculation.sol";

contract PolicyCalculationType2 is PolicyCalculation {

  // Override functions

  // daily_benefit_amount : Int
  // policy_claimable_amount: Int
  // hospital_days : Int
  // fee : Decimal(19,4)x4
  // claim_adjustment : Decimal(19,9)x9
  // return Decimal(19,4)x4
  function Calculate(uint daily_benefit_amount, uint policy_claimable_amount, uint hospital_days, uint fee, uint claim_adjustment) returns(uint) {
    //uint a1 = maths.Min(fee, (policy_claimable_amount * 10000)); //x4
    uint a2 = daily_benefit_amount * hospital_days * 1000000000; //x1

    //uint b1 = maths.Max(a1, (a2*10000)) * 100000; //x9
    //uint b2 = (daily_benefit_amount * claim_adjustment); //x9

    return a2 / 100000; //x4
  }
}