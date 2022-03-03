// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.6;

interface IOracleController {
  function oracles() external returns (address[] memory);
  function oracle(uint256 _oracleNum) external returns (address);
  function oracleLength() external returns (uint256);

  function setOracleData(int256[] memory _data) external;
}