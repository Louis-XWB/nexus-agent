import { describe, it, expect } from "vitest";

describe("Route comparison sorting", () => {
  it("should select the quote with highest output amount", () => {
    const quotes = [
      { source: "okx-dex" as const, toAmount: "1000000" },
      { source: "uniswap" as const, toAmount: "1050000" },
    ];
    quotes.sort((a, b) => {
      const amountA = BigInt(a.toAmount);
      const amountB = BigInt(b.toAmount);
      if (amountB > amountA) return 1;
      if (amountB < amountA) return -1;
      return 0;
    });
    expect(quotes[0].source).toBe("uniswap");
    expect(quotes[0].toAmount).toBe("1050000");
  });

  it("should handle single quote", () => {
    const quotes = [{ source: "okx-dex" as const, toAmount: "1000000" }];
    expect(quotes[0].source).toBe("okx-dex");
  });

  it("should handle equal quotes", () => {
    const quotes = [
      { source: "okx-dex" as const, toAmount: "1000000" },
      { source: "uniswap" as const, toAmount: "1000000" },
    ];
    quotes.sort((a, b) => {
      const amountA = BigInt(a.toAmount);
      const amountB = BigInt(b.toAmount);
      if (amountB > amountA) return 1;
      if (amountB < amountA) return -1;
      return 0;
    });
    expect(quotes).toHaveLength(2);
  });
});
