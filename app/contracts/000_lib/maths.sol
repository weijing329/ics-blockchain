pragma solidity ^0.4.8;
library maths {
  function Max(uint a, uint b) internal returns (uint) {
    if (a > b) {
      return a;
    }
    else {
      return b;
    }
  }

  function Min(uint a, uint b) internal returns (uint) {
    if (a < b) {
      return a;
    }
    else {
      return b;
    }
  }
}