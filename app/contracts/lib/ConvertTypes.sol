pragma solidity ^0.4.6;

import "lib/strings.sol";

library ConvertTypes {
  using strings for *;

  function StringToBytes32(string memory source) internal returns (bytes32 result) {
    assembly {
        result := mload(add(source, 32))
    }
  }

  function Bytes32ToString(bytes32 source) internal returns (string) {
    string memory new_string = strings.toSliceB32(source).toString();
    return new_string;
  }
}