export const retryRequest = async (
    fn: () => Promise<any>,
    retries = 0
  ) => {
    let attempt = 0;
    while (attempt <= retries) {
      try {
        return await fn();
      } catch (e) {
        if (attempt === retries) throw e;
        attempt++;
      }
    }
  };