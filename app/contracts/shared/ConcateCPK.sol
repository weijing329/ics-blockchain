pragma solidity ^0.4.6;

import "lib/strings.sol";
import "lib/ConvertTypes.sol";

contract ConcateCPK {
  using strings for *;
  // using convert_types for *;

  string public string_CPK; // javascript: ConcateCPKtoString._originalContractObject.string_CPK();

  function ConcatCPKtoBytes32(string s1, string s2, string s3) returns(bytes32) {
    return ConvertTypes.StringToBytes32(ConcatCPK(s1, s2, s3));
  }

  function ConcatCPKtoBytes32(string s1, string s2) returns(bytes32) {
    return ConvertTypes.StringToBytes32(ConcatCPK(s1, s2));
  }

  function ConcatCPK(string s1, string s2, string s3) returns(string) {
    ConcatCPK(ConcatCPK(s1, s2), s3);
    return string_CPK;
  }

  function ConcatCPK(string s1, string s2) returns(string){
    string_CPK = Concat(Concat(s1, "|"), s2);
    return string_CPK;
  }

  function Concat(string s1, string s2) internal returns(string){
    return s1.toSlice().concat(s2.toSlice());
  }

}