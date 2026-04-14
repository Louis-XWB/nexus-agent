import { okxPost } from "./client";

const CHAIN_INDEX = "196";

export async function estimateGas(params: { fromAddr: string; toAddr: string; txAmount?: string; inputData?: string }): Promise<{ gasLimit: string }> {
  const data = await okxPost<{ gasLimit: string }[]>("/api/v5/wallet/pre-transaction/gas-limit", {
    chainIndex: CHAIN_INDEX, fromAddr: params.fromAddr, toAddr: params.toAddr,
    txAmount: params.txAmount || "0", extJson: params.inputData ? { inputData: params.inputData } : undefined,
  });
  return data[0];
}

export async function broadcastTransaction(params: { signedTx: string; address: string }): Promise<{ orderId: string }> {
  const data = await okxPost<{ orderId: string }[]>("/api/v5/wallet/pre-transaction/broadcast-transaction", {
    signedTx: params.signedTx, chainIndex: CHAIN_INDEX, address: params.address,
  });
  return data[0];
}
