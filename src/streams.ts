/**
 * Returns a throttled version of the source function.
 *
 * `source` will be called when the throttled function is called. It will be passed another function
 *  that should be called with the values to be throttled.
 *
 * After `dueTime` milliseconds, the throttled function will be called with the last value passed to
 * the throttled function.
 *
 * @param source
 * @param dueTime
 *
 * @returns
 */
export function auditTime<T>(
  source: (subscription: (throttledValue: T) => void) => void,
  dueTime: number,
): (subscription: (throttledValue: T) => void) => void {
  let timeoutId: number | null = null;
  let lastValue: T | null = null;

  return (next) => {
    source((value) => {
      lastValue = value;

      if (!timeoutId) {
        timeoutId = window.setTimeout(() => {
          next(lastValue!);
          clearTimeout(timeoutId!);
          timeoutId = null;
        }, dueTime);
      }
    });
  };
}
