export const createCircuitBreaker = (config?: any) => {
    if (!config?.enabled) {
      return {
        canExecute: () => true,
        onSuccess: () => {},
        onFailure: () => {},
        getState: () => "CLOSED"
      };
    }
  
    let state = "CLOSED";
    let failures = 0;
    let nextTry = 0;
  
    return {
      canExecute: () => {
        if (state === "OPEN") {
          if (Date.now() > nextTry) {
            state = "HALF_OPEN";
            return true;
          }
          return false;
        }
        return true;
      },
      onSuccess: () => {
        state = "CLOSED";
        failures = 0;
      },
      onFailure: () => {
        failures++;
        if (failures >= (config.failureThreshold ?? 3)) {
          state = "OPEN";
          nextTry = Date.now() + (config.timeoutMs ?? 10000);
        }
      },
      getState: () => state
    };
  };