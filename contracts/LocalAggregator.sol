// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.6;
pragma abicoder v2;

import {Owned} from "./interfaces/AggregatorInterfaces.sol";
import "./interfaces/IOracleController.sol";

contract LocalAggregator is Owned {
  int256 private _latestAnswer;
  string public description;
  uint80 public decimals;
  uint256 public roundIdLength;
  IOracleController public controller;

  struct Type {
    uint80 roundId;
    int256 answer;
    uint256 startedAt;
    uint256 timestamp;
    uint80 answeredInRound;
  }

  event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 timestamp);

  constructor(string memory _description, uint80 _decimals) public Owned() {
    _latestAnswer = 0;
    description = _description;
    decimals = _decimals;
  }

  function setController(address _controller) external onlyOwner {
    controller = IOracleController(_controller);
  }

  function setAnswer(int256 answer) external {
    require(msg.sender == address(controller));
    _latestAnswer = answer;
    emit AnswerUpdated(answer, 0, block.timestamp);
  }

  function latestAnswer() external view returns (int256) {
    return _latestAnswer;
  }

  function latestRoundData() external view returns (Type memory) {
    Type memory typeName;
    typeName.roundId = 1;
    typeName.answer = _latestAnswer;
    typeName.timestamp = block.timestamp;
    return typeName;
  }
}
