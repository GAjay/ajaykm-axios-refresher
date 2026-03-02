let history: number[] = [];

export const detectAnomaly = async (config?: any) => {
  if (!config) return;

  const now = Date.now();
  history.push(now);
  history = history.filter(t => now - t < 60000);

  if (history.length > (config.maxPerMinute ?? 5)) {
    if (config.reportToServer && config.reportEndpoint) {
      await fetch(config.reportEndpoint, {
        method: "POST",
        body: JSON.stringify({
          type: "excessive_refresh",
          timestamp: now
        })
      });
    }
  }
};