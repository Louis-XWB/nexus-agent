import * as okxSwap from "./okx/swap";
import * as uniswapSwap from "./uniswap/swap";

export interface RouteQuote {
  source: "okx-dex" | "uniswap";
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  toAmountUSD: number;
  gasEstimate: string;
  priceImpact: string;
  rawQuote: unknown;
}

export interface RouteComparison {
  best: RouteQuote;
  all: RouteQuote[];
  savings: string;
}

export async function compareRoutes(params: { fromToken: string; toToken: string; amount: string; walletAddress: string }): Promise<RouteComparison> {
  const quotes: RouteQuote[] = [];

  const [okxResult, uniResult] = await Promise.allSettled([
    okxSwap.getSwapQuote({ fromTokenAddress: params.fromToken, toTokenAddress: params.toToken, amount: params.amount }),
    uniswapSwap.getQuote({ fromToken: params.fromToken, toToken: params.toToken, amount: params.amount, swapper: params.walletAddress }),
  ]);

  if (okxResult.status === "fulfilled" && okxResult.value[0]) {
    const q = okxResult.value[0];
    quotes.push({
      source: "okx-dex", fromToken: params.fromToken, toToken: params.toToken,
      fromAmount: q.fromTokenAmount, toAmount: q.toTokenAmount,
      toAmountUSD: parseFloat(q.toToken.tokenUnitPrice) * parseFloat(q.toTokenAmount) / Math.pow(10, parseInt(q.toToken.decimal)),
      gasEstimate: q.estimateGasFee, priceImpact: q.priceImpactPercentage, rawQuote: q,
    });
  }

  if (uniResult.status === "fulfilled") {
    const q = uniResult.value.quote;
    quotes.push({
      source: "uniswap", fromToken: params.fromToken, toToken: params.toToken,
      fromAmount: q.input.amount, toAmount: q.output.amount,
      toAmountUSD: 0, gasEstimate: q.gasUseEstimate, priceImpact: String(q.priceImpact), rawQuote: uniResult.value,
    });
  }

  if (quotes.length === 0) throw new Error("No quotes available from either DEX");

  quotes.sort((a, b) => {
    const amountA = BigInt(a.toAmount);
    const amountB = BigInt(b.toAmount);
    if (amountB > amountA) return 1;
    if (amountB < amountA) return -1;
    return 0;
  });

  const best = quotes[0];
  const worst = quotes[quotes.length - 1];
  const savingsBps = quotes.length > 1
    ? ((Number(BigInt(best.toAmount) - BigInt(worst.toAmount)) / Number(BigInt(worst.toAmount))) * 10000).toFixed(0)
    : "0";

  return { best, all: quotes, savings: `${savingsBps} bps` };
}
