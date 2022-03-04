// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.6;

import {Owned} from "./interfaces/AggregatorInterfaces.sol";
import "./interfaces/IOracleController.sol";

interface ILocalAggregator {
  function setAnswer(int256 answer) external;
}

contract OracleController is Owned, IOracleController {

  mapping(uint256 => address) public override oracle;
  uint256 public override oracleLength;

  constructor (address[] memory oracles) public Owned() {
    for (uint256 i = 0; i < oracles.length; i++) {
      oracle[i] = oracles[i];
      oracleLength += 1;
    }
  }

  function oracles() public override returns (address[] memory) {
    address[] memory oracles = new address[](oracleLength);
    for (uint256 i = 0; i < oracleLength; i++) {
      oracles[i] = oracle[i];
    }
    return oracles;
  }

  function addOracle(address newOracle) public onlyOwner {
    oracle[oracleLength] = newOracle;
    oracleLength += 1;
  }

  function setOracleData(int256[] memory _data) external override onlyOwner {
    for (uint256 i = 0; i < oracleLength; i++) {
      ILocalAggregator agg = ILocalAggregator(_data[i]);
      agg.setAnswer(_data[i]);
    }
  }
}