import { okxPost } from "./client";
import type { WalletTokenBalance } from "./types";

const CHAIN_INDEX = "196";

export async function getTokenBalances(
  accountId: string,
  tokenAddresses?: { chainIndex: string; tokenAddress: string }[]
): Promise<WalletTokenBalance[]> {
  const body: Record<string, unknown> = { accountId };
  if (tokenAddresses) body.tokenAddresses = tokenAddresses;
  const data = await okxPost<{ tokenAssets: WalletTokenBalance[] }[]>(
    "/api/v5/wallet/asset/token-balances", body
  );
  return data[0]?.tokenAssets ?? [];
}

export async function getAllBalances(accountId: string, chains: string = CHAIN_INDEX): Promise<WalletTokenBalance[]> {
  const data = await okxPost<{ tokenAssets: WalletTokenBalance[] }[]>(
    "/api/v5/wallet/asset/token-balances",
    { accountId, tokenAddresses: [{ chainIndex: chains, tokenAddress: "" }] }
  );
  return data[0]?.tokenAssets ?? [];
}
