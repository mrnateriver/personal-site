export type CssVariable = `var(--${string})`;
export type CalcExpression = `calc(${string})`;

export function isCssVariable(value: unknown): value is CssVariable {
  return typeof value === 'string' && /^var\(--[-\w]+\)$/.test(value);
}

export function isCalcExpression(value: unknown): value is CalcExpression {
  return typeof value === 'string' && /^calc\(.*?\)$/.test(value);
}

export function normalizeCssValue(value: CssVariable | CalcExpression | string | number, defaultUnit?: string): string {
  if (typeof value === 'number') {
    return `${value}${defaultUnit ?? ''}`;
  }

  return value;
}
