import numbro from 'numbro';

const tokens = {
  NEAR: {
    decimals: 24,
  },
  TARAS: {
    decimals: 18,
  },
  fallback: {
    decimals: 18,
  },
};

export function TokenFormatter(tokenName) {
  let token = tokens[tokenName] || tokens.fallback;

  const TICK_TO_MS = Math.pow(10, 6);
  const TICK_TO_S = Math.pow(10, 9);
  const MP = Math.pow(10, token.decimals);

  return {
    amount: (amount) =>
      numbro(amount).divide(MP).format({
        mantissa: 2,
      }),
    tokensPerMS: (tokensPerTick) =>
      numbro(tokensPerTick)
        .multiply(TICK_TO_MS)
        .divide(MP)
        .format({
          mantissa: token.decimals - 6,
          trimMantissa: true,
        }),
    tokensPerS: (tokensPerTick) =>
      numbro(tokensPerTick)
        .multiply(TICK_TO_S)
        .divide(MP)
        .format({
          mantissa: token.decimals - 6,
          trimMantissa: true,
        }),
    ticksToMs: (ticks) => Math.round(ticks / TICK_TO_MS),
  };
}