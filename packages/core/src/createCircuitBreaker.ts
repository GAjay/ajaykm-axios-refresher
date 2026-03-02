export const createCircuitBreaker = (config?: {
  enabled?: boolean;
  failureThreshold?: number;
  successThreshold?: number;
  timeoutMs?: number;
}) => {
  if (!config?.enabled) {
    return {
      canExecute: () => true,
      onSuccess: () => {},
      onFailure: () => {},
      getState: () => "CLOSED"
    };
  }

  let state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  let failures = 0;
  let successes = 0;
  let nextTry = 0;

  const failureThreshold = config.failureThreshold ?? 3;
  const successThreshold = config.successThreshold ?? 1;
  const timeoutMs = config.timeoutMs ?? 10000;

  const now = () => Date.now();

  const canExecute = () => {
    if (state === "OPEN") {
      if (now() >= nextTry) {
        state = "HALF_OPEN";
        return true;
      }
      return false;
    }
    return true;
  };

  const onSuccess = () => {
    if (state === "HALF_OPEN") {
      successes++;
      if (successes >= successThreshold) {
        state = "CLOSED";
        failures = 0;
        successes = 0;
      }
    } else {
      failures = 0;
    }
  };

  const onFailure = () => {
    failures++;
    if (failures >= failureThreshold) {
      state = "OPEN";
      nextTry = now() + timeoutMs;
    }
  };

  return {
    canExecute,
    onSuccess,
    onFailure,
    getState: () => state
  };
};