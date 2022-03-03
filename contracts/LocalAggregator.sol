// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.7.6;
pragma abicoder v2;

import "./interfaces/IOracleController.sol";

contract LocalAggregator {
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

  constructor(int256 _initialAnswer, uint80 _decimals, address _controller) public {
    _latestAnswer = _initialAnswer;
    decimals = _decimals;
    controller = IOracleController(_controller);
    emit AnswerUpdated(_initialAnswer, 0, block.timestamp);
  }

  function setAnswer(int256 answer) external {
    require(msg.sender == address(controller));
    _latestAnswer = answer;
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
