// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/NexusRegistry.sol";

contract NexusRegistryTest is Test {
    NexusRegistry public registry;
    address public owner = address(this);
    address public agent = address(0xABCD);
    address public stranger = address(0xDEAD);

    function setUp() public {
        registry = new NexusRegistry(agent);
    }

    function test_InitialState() public view {
        assertEq(registry.owner(), owner);
        assertEq(registry.agentWallet(), agent);
        assertEq(registry.maxTradePercent(), 10);
        assertEq(registry.reservePercent(), 20);
        assertEq(registry.minConfidence(), 60);
        assertEq(registry.maxDailyLoss(), 5);
    }

    function test_LogAction() public {
        vm.prank(agent);
        registry.logAction("SWAP", "WETH whale accumulation", 50e18);
        assertEq(registry.totalActions(), 1);
        assertEq(registry.totalSwaps(), 1);
    }

    function test_LogActionAsOwner() public {
        registry.logAction("SWAP", "Manual swap", 100e18);
        assertEq(registry.totalActions(), 1);
    }

    function test_RevertLogActionStranger() public {
        vm.prank(stranger);
        vm.expectRevert("Not agent");
        registry.logAction("SWAP", "hack attempt", 999e18);
    }

    function test_UpdateConfig() public {
        registry.updateConfig("maxTradePercent", 15);
        assertEq(registry.maxTradePercent(), 15);
    }

    function test_RevertUpdateConfigStranger() public {
        vm.prank(stranger);
        vm.expectRevert("Not owner");
        registry.updateConfig("maxTradePercent", 99);
    }

    function test_RevertUpdateConfigInvalid() public {
        vm.expectRevert("Invalid percent");
        registry.updateConfig("maxTradePercent", 0);
        vm.expectRevert("Invalid percent");
        registry.updateConfig("maxTradePercent", 101);
    }

    function test_SetAgent() public {
        address newAgent = address(0x1234);
        registry.setAgent(newAgent);
        assertEq(registry.agentWallet(), newAgent);
    }

    function test_RevertSetAgentZero() public {
        vm.expectRevert("Zero address");
        registry.setAgent(address(0));
    }

    function test_GetStats() public {
        vm.startPrank(agent);
        registry.logAction("SWAP", "swap 1", 10e18);
        registry.logAction("SKIP", "too risky", 0);
        registry.logAction("SWAP", "swap 2", 20e18);
        vm.stopPrank();
        (uint256 total, uint256 swaps, uint256 skips) = registry.getStats();
        assertEq(total, 3);
        assertEq(swaps, 2);
        assertEq(skips, 1);
    }
}
