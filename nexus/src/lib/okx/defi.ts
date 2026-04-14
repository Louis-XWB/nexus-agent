import { okxPost } from "./client";
import type { DeFiProduct } from "./types";

export async function getDeFiProducts(network: string = "X Layer", investType: string = "100"): Promise<DeFiProduct[]> {
  return okxPost<DeFiProduct[]>("/api/v5/defi/explore/product/list", { simplifyInvestType: investType, network, limit: "10" });
}

export async function getDeFiSubscriptionTx(params: { address: string; investmentId: string; coinAmount: string; tokenAddress?: string }): Promise<unknown> {
  return okxPost("/api/v5/defi/transaction/subscription", {
    address: params.address, investmentId: params.investmentId,
    userInputList: [{ coinAmount: params.coinAmount, tokenAddress: params.tokenAddress || "" }],
  });
}

export async function getDeFiRedemptionTx(params: { address: string; investmentId: string; coinAmount: string }): Promise<unknown> {
  return okxPost("/api/v5/defi/transaction/redemption", {
    address: params.address, investmentId: params.investmentId, userInputList: [{ coinAmount: params.coinAmount }],
  });
}

export async function getUserDeFiPositions(address: string): Promise<unknown[]> {
  return okxPost<unknown[]>("/api/v5/defi/user/asset/platform/list", { address });
}
