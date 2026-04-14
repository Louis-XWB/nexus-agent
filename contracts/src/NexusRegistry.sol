// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract NexusRegistry {
    address public owner;
    address public agentWallet;

    uint256 public maxTradePercent = 10;
    uint256 public reservePercent = 20;
    uint256 public minConfidence = 60;
    uint256 public maxDailyLoss = 5;

    uint256 public totalActions;
    uint256 public totalSwaps;
    uint256 public totalSkips;

    event AgentAction(string actionType, string reason, uint256 amount, uint256 timestamp);
    event ConfigUpdated(string param, uint256 oldVal, uint256 newVal);
    event AgentWalletUpdated(address oldAgent, address newAgent);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    modifier onlyAgent() { require(msg.sender == agentWallet || msg.sender == owner, "Not agent"); _; }

    constructor(address _agentWallet) {
        owner = msg.sender;
        agentWallet = _agentWallet;
    }

    function logAction(string calldata actionType, string calldata reason, uint256 amount) external onlyAgent {
        totalActions++;
        if (keccak256(bytes(actionType)) == keccak256(bytes("SWAP"))) totalSwaps++;
        else if (keccak256(bytes(actionType)) == keccak256(bytes("SKIP"))) totalSkips++;
        emit AgentAction(actionType, reason, amount, block.timestamp);
    }

    function updateConfig(string calldata param, uint256 value) external onlyOwner {
        bytes32 paramHash = keccak256(bytes(param));
        if (paramHash == keccak256(bytes("maxTradePercent"))) {
            require(value > 0 && value <= 100, "Invalid percent");
            emit ConfigUpdated(param, maxTradePercent, value);
            maxTradePercent = value;
        } else if (paramHash == keccak256(bytes("reservePercent"))) {
            require(value <= 100, "Invalid percent");
            emit ConfigUpdated(param, reservePercent, value);
            reservePercent = value;
        } else if (paramHash == keccak256(bytes("minConfidence"))) {
            require(value <= 100, "Invalid percent");
            emit ConfigUpdated(param, minConfidence, value);
            minConfidence = value;
        } else if (paramHash == keccak256(bytes("maxDailyLoss"))) {
            require(value > 0 && value <= 100, "Invalid percent");
            emit ConfigUpdated(param, maxDailyLoss, value);
            maxDailyLoss = value;
        } else {
            revert("Unknown param");
        }
    }

    function setAgent(address newAgent) external onlyOwner {
        require(newAgent != address(0), "Zero address");
        emit AgentWalletUpdated(agentWallet, newAgent);
        agentWallet = newAgent;
    }

    function getConfig() external view returns (uint256, uint256, uint256, uint256) {
        return (maxTradePercent, reservePercent, minConfidence, maxDailyLoss);
    }

    function getStats() external view returns (uint256, uint256, uint256) {
        return (totalActions, totalSwaps, totalSkips);
    }
}
