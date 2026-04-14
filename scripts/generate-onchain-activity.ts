import { createWalletClient, createPublicClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";

const xlayer = defineChain({
  id: 196,
  name: "X Layer",
  nativeCurrency: { name: "OKB", symbol: "OKB", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.xlayer.tech"] } },
  blockExplorers: { default: { name: "OKLink", url: "https://www.oklink.com/x-layer" } },
});

const REGISTRY_ADDRESS = "0x3050BFe3a2fa1b4a8f47b1948DA7A0cB573e4B32" as const;
const PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY as `0x${string}`;

const abi = parseAbi([
  "function logAction(string calldata actionType, string calldata reason, uint256 amount) external",
  "function getStats() external view returns (uint256, uint256, uint256)",
]);

const account = privateKeyToAccount(PRIVATE_KEY);

const walletClient = createWalletClient({
  account,
  chain: xlayer,
  transport: http(),
});

const publicClient = createPublicClient({
  chain: xlayer,
  transport: http(),
});

const actions = [
  { type: "SWAP", reason: "WETH whale accumulation — 3 smart money wallets bought >200K in 2h. Route: Uniswap, savings 12bps", amount: 50n * 10n ** 18n },
  { type: "SKIP", reason: "XDOG trending but risk score 78 — honeypot detected, dev sold 60% supply", amount: 0n },
  { type: "DEFI", reason: "Idle USDC exceeds reserve — depositing 200 USDC to Aave for 4.2% APY", amount: 200n * 10n ** 18n },
  { type: "SWAP", reason: "Smart money accumulating OKB — 5 wallets net bought 500K. Route: OKX DEX, savings 8bps", amount: 80n * 10n ** 18n },
  { type: "x402_EARN", reason: "x402 payment received: trending tokens intelligence query from 0xabc...", amount: 10000n },
  { type: "SWAP", reason: "Taking profit on WETH — price up 3.2% since entry. Route: Uniswap, savings 5bps", amount: 52n * 10n ** 18n },
  { type: "SKIP", reason: "Market volatility high — daily loss approaching 3%, reducing exposure per safety rails", amount: 0n },
  { type: "x402_EARN", reason: "x402 payments: 3x smart money signal queries from external agents", amount: 150000n },
  { type: "SWAP", reason: "USDT depeg signal — rotating to USDC for safety. Route: OKX DEX, savings 3bps", amount: 100n * 10n ** 18n },
  { type: "x402_PAY", reason: "Purchased external market news feed via x402 protocol", amount: 10000n },
  { type: "SWAP", reason: "ETH/OKB ratio at 30-day low — accumulating OKB. Route: Uniswap, savings 15bps", amount: 30n * 10n ** 18n },
  { type: "DEFI", reason: "Claiming Aave rewards — 0.5 USDC accrued interest", amount: 5n * 10n ** 17n },
  { type: "SWAP", reason: "Arbitrage opportunity: OKX DEX price 0.3% lower than Uniswap for WETH. Route: OKX DEX", amount: 40n * 10n ** 18n },
  { type: "SKIP", reason: "New token MOONX has 90% top-10 holder concentration — auto-rejected by safety rails", amount: 0n },
  { type: "x402_EARN", reason: "x402 payment: cross-DEX route comparison query from DeFi aggregator agent", amount: 30000n },
];

async function main() {
  console.log(`Generating ${actions.length} on-chain actions on X Layer...`);
  console.log(`Wallet: ${account.address}`);
  console.log(`Registry: ${REGISTRY_ADDRESS}`);

  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Balance: ${Number(balance) / 1e18} OKB\n`);

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    try {
      const hash = await walletClient.writeContract({
        address: REGISTRY_ADDRESS,
        abi,
        functionName: "logAction",
        args: [action.type, action.reason, action.amount],
      });
      console.log(`[${i + 1}/${actions.length}] ${action.type}: ${hash}`);

      // Wait for confirmation
      await publicClient.waitForTransactionReceipt({ hash });
    } catch (error) {
      console.error(`[${i + 1}] Failed: ${error}`);
    }
  }

  // Check final stats
  const stats = await publicClient.readContract({
    address: REGISTRY_ADDRESS,
    abi,
    functionName: "getStats",
  });
  console.log(`\nFinal stats — Total: ${stats[0]}, Swaps: ${stats[1]}, Skips: ${stats[2]}`);

  const finalBalance = await publicClient.getBalance({ address: account.address });
  console.log(`Remaining balance: ${Number(finalBalance) / 1e18} OKB`);
}

main().catch(console.error);
